import React, { useEffect } from "react";
import { NextSeo } from "next-seo";

import { areaConfig } from "@data/areaConfig";
import { categoryItemsConfig } from "@data/categoryItemsConfig";
import { mapConfig } from "@data/index";
import { useMapContext } from "@context/app-context";
import AppMap from "@components/Map/AppMap";
import { Loader } from "@components/Loader";
import { useLoading } from "@hooks/useLoading";

export async function getStaticProps(context) {
  const areaId = context.params.slug;

  const config = areaConfig.find((o) => o.name === areaId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}`
  );

  const { data: markers } = await res.json();
  const markersList = [];
  const textOverlay = [];
  const clusterGroups = [];
  const pathMarkers = [];

  const markerGroups = [];
  const categoryCounts = {};
  const seen = new Set();
  const seenCategory = new Set();

  markers.map((marker) => {
    const {
      markerTypeId,
      categoryId,
      _id,
      coordinate,
      markerName,
      zoomRange,
      path,
      parentId,
      descriptions,
    } = marker;

    categoryCounts[categoryId] = categoryCounts[categoryId] + 1 || 1;

    if (markerTypeId === 1) {
      const standard = {
        id: _id,
        coordinate: coordinate,
        categoryId: categoryId,
        markerName: markerName,
        descriptions: descriptions,
      };

      markersList.push(standard);
    } else if (markerTypeId === 2) {
      const textOverlayMarker = {
        id: _id,
        coordinate: coordinate,
        markerName: markerName,
        zoomRange: zoomRange,
      };

      textOverlay.push(textOverlayMarker);
    } else if (markerTypeId === 3) {
      if (seen.has(categoryId)) {
        clusterGroups.map((group, i) => {
          if (group.categoryId === categoryId) {
            const current = clusterGroups[i].coordinates;
            const newCoords = [...current, coordinate];
            clusterGroups[i].coordinates = [...newCoords];
          }
        });
      } else {
        let groupName = "";
        categoryItemsConfig.map((item) => {
          if (item.gameSlug === config.gameSlug) {
            item.categoryGroups.map(({ members, name }) => {
              if (members.includes(categoryId)) {
                groupName = name;
              }
            });
          }
        });

        clusterGroups.push({
          categoryId: categoryId,
          coordinates: [coordinate],
          group: groupName
        });
        seen.add(categoryId);
      }
    } else if (markerTypeId === 4) {
      pathMarkers.push({ path: path, parentId: parentId });
    }
  });

  const sortedMarkers = [...markersList];
  sortedMarkers.sort((a, b) => b.coordinate[0] - a.coordinate[0]);

  sortedMarkers.map(({ categoryId, coordinate, id }, rank) => {
    if (seenCategory.has(categoryId)) {
      markerGroups.map((group, i) => {
        const {
          coordinates: groupCoordinates,
          ids: currIds,
          categoryId: currCategoryId,
          ranks,
        } = group;
        if (currCategoryId === categoryId) {
          markerGroups[i].coordinates = [...groupCoordinates, coordinate];
          markerGroups[i].ids = [...currIds, id];
          markerGroups[i].ranks = [...ranks, rank];
        }
      });
    } else {
      let groupName = "locations";
      categoryItemsConfig.map((item) => {
        if (item.gameSlug === config.gameSlug) {
          item.categoryGroups.map(({ members, name }) => {
            if (members.includes(categoryId)) {
              groupName = name;
            }
          });
        }
      });

      markerGroups.push({
        categoryId: categoryId,
        coordinates: [coordinate],
        ids: [id],
        ranks: [rank],
        group: groupName,
      });
      seenCategory.add(categoryId);
    }
  });

  return {
    props: {
      areaId,
      config,
      categoryCounts,
      textOverlay,
      clusterGroups,
      pathMarkers,
      markerGroups,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const paths = [];

  mapConfig.map((conf) => {
    conf.mapOptions.map((option) => {
      paths.push(`/map/${option.path}`);
    });
  });

  return {
    paths,
    fallback: false,
  };
}

const MapPage = ({
  areaId,
  config,
  categoryCounts,
  textOverlay,
  clusterGroups,
  pathMarkers,
  markerGroups,
}) => {
  const [loading] = useLoading();

  const {
    setConfig,
    setCategoryCounts,
    setTextOverlay,
    setPathMarkers,
    setClusterGroups,
    setMarkerGroups,
  } = useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryCounts(categoryCounts);
    setTextOverlay(textOverlay);
    setPathMarkers(pathMarkers);
    setClusterGroups(clusterGroups);
    setMarkerGroups(markerGroups);
  }, [areaId]);

  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      {loading ? <Loader loading={loading}/> : <AppMap />}
    </>
  );
};

export default MapPage;
