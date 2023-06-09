import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";

import { areaConfig } from "@data/areaConfig";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { categoryItemsConfig } from "@data/categoryItemsConfig";
import { COMPLETED, USER_SETTING } from "@data/LocalStorage";
import { mapConfig } from "@data/index";
import { useMapContext } from "src/context/app-context";
import AppMap from "@components/Map/AppMap";
import { Loader } from "@components/Loader";
import useLocalStorage from "@hooks/useLocalStorage";
import { useRouter } from "next/router";

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
        clusterGroups.push({
          categoryId: categoryId,
          coordinates: [coordinate],
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
      config,
      categoryCounts,
      textOverlay,
      clusterGroups,
      pathMarkers,
      markerGroups
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
  config,
  categoryCounts,
  textOverlay,
  clusterGroups,
  pathMarkers,
  markerGroups
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  const {
    setConfig,
    setCategoryCounts,
    setTextOverlay,
    setPathMarkers,
    setClusterGroups,
    setMarkerGroups
  } = useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryCounts(categoryCounts);
    setTextOverlay(textOverlay);
    setPathMarkers(pathMarkers);
    setClusterGroups(clusterGroups);
    setMarkerGroups(markerGroups);
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      <AppMap />
    </>
  );
};

export default MapPage;
