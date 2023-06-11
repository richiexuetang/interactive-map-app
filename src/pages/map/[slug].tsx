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

  const textMarkerType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/2`
  );
  const textOverlay = await textMarkerType.json();

  const markerType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/1`
  );
  const markersList = await markerType.json();

  const pathType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/4`
  );

  const pathMarkers = await pathType.json();

  const clusterType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/3`
  );
  const clusterMarkers = await clusterType.json();

  const clusterGroups = [];

  const markerGroups = [];
  const categoryCounts = {};
  const seen = new Set();
  const seenCategory = new Set();
  const categoryMap = [];

  clusterMarkers.map((marker) => {
    const { categoryId, coordinate } = marker;

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

      categoryMap.push(categoryId);
      clusterGroups.push({
        categoryId: categoryId,
        coordinates: [coordinate],
        group: groupName,
      });
      seen.add(categoryId);
    }
  });

  markersList.map(({ categoryId, coordinate, _id }, rank) => {
    categoryCounts[categoryId] = categoryCounts[categoryId] + 1 || 1;
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
          markerGroups[i].ids = [...currIds, _id];
          markerGroups[i].ranks = [...ranks, rank];
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

      categoryMap.push(categoryId);
      markerGroups.push({
        categoryId: categoryId,
        coordinates: [coordinate],
        ids: [_id],
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
      categoryMap,
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
  categoryMap,
}) => {
  const [loading] = useLoading();

  const {
    setConfig,
    setCategoryCounts,
    setTextOverlay,
    setPathMarkers,
    setClusterGroups,
    setMarkerGroups,
    setCategoryMap,
  } = useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryCounts(categoryCounts);
    setTextOverlay(textOverlay);
    setPathMarkers(pathMarkers);
    setClusterGroups(clusterGroups);
    setMarkerGroups(markerGroups);
    setCategoryMap(categoryMap);
  }, [areaId]);

  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      {loading ? <Loader loading={loading} /> : <AppMap />}
    </>
  );
};

export default MapPage;
