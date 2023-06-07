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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}`
  );

  const { data: markers } = await res.json();
  const standardMarkers = [];
  const textOverlay = [];
  const clusterGroups = [];
  const pathMarkers = [];

  const categoryCounts = {};
  const seen = new Set();

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
      standardMarkers.push(standard);
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

  const sortedMarkers = [...standardMarkers];
  sortedMarkers.sort((a, b) => b.coordinate[0] - a.coordinate[0]);

  const config = areaConfig.find((o) => o.name === areaId);

  const categoryItems = categoryItemsConfig.find(
    (o) => o.gameSlug === config.gameSlug
  );

  return {
    props: {
      config,
      categoryItems,
      categoryCounts,
      standardMarkers: sortedMarkers,
      textOverlay,
      clusterGroups,
      pathMarkers,
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
  categoryItems,
  categoryCounts,
  standardMarkers,
  textOverlay,
  clusterGroups,
  pathMarkers,
}) => {
  if (typeof window !== "undefined") {
    useLocalStorage(USER_SETTING, initialUserSettings);
    useLocalStorage(COMPLETED, {});
  }

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
    setCategoryItems,
    setCategoryCounts,
    setStandardMarker,
    setTextOverlay,
    setPathMarkers,
    setClusterGroups,
  } = useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryItems(categoryItems);
    setCategoryCounts(categoryCounts);
    setStandardMarker(standardMarkers);
    setTextOverlay(textOverlay);
    setPathMarkers(pathMarkers);
    setClusterGroups(clusterGroups);
  }, [areaId, config, categoryItems]);

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
