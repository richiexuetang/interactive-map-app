import React, { useEffect } from "react";
import { NextSeo } from "next-seo";

import { areaConfig } from "@data/areaConfig";
import { categoryItemsConfig, mapConfig } from "@data/index";
import { useMapContext } from "@context/app-context";
import AppMap from "@components/Map/AppMap";
import { Loader } from "@components/Loader";
import { useLoading } from "@hooks/useLoading";
import { getGroupName } from "@lib/getGroupName";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import ProgressTracker from "@components/Sidebar/ProgressTracker";

export async function getStaticProps(context) {
  const areaId = context.params.slug;

  const config = areaConfig.find((o) => o.name === areaId);

  const markerType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/1`
  );
  const markersList = await markerType.json();

  const textMarkerType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/2`
  );
  const textOverlay = await textMarkerType.json();

  const clusterType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/3`
  );
  const clusterMarkers = await clusterType.json();

  const pathType = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}/4`
  );
  const pathMarkers = await pathType.json();

  const categoryCounts = {};

  const markers = [...markersList, ...clusterMarkers];
  const groups = [];

  pathMarkers.map(({categoryId}) => {
    categoryCounts[categoryId] = categoryCounts[categoryId] + 1 || 1;
  })
  
  markers.map((marker, rank) => {
    categoryCounts[marker.categoryId] =
      categoryCounts[marker.categoryId] + 1 || 1;
    const { categoryId, coordinate, markerTypeId, _id: id } = marker;

    const groupIndex = groups.findIndex(
      (group) => group.categoryId === categoryId
    );
    if (groupIndex === -1) {
      const groupName = getGroupName(config.gameSlug, categoryId);
      const newGroup = {
        categoryId: categoryId,
        coordinates: [coordinate],
        group: groupName,
        markerTypeId: markerTypeId,
        ids: [id],
        ranks: [rank],
      };
      groups.push(newGroup);
    } else {
      const categoryGroup = groups[groupIndex];
      categoryGroup.coordinates = [...categoryGroup.coordinates, coordinate];
      categoryGroup.ids = [...categoryGroup.ids, id];
      categoryGroup.ranks = [...categoryGroup.ranks, rank];
    }
  });

  return {
    props: {
      config,
      categoryCounts,
      textOverlay,
      pathMarkers,
      groups,
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
  pathMarkers,
  groups,
}) => {
  const { asPath } = useRouter();
  const [loading] = useLoading();

  const { setConfig, setCategoryCounts, categoryMap, setCategoryMap } = useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryCounts(categoryCounts);
  }, [asPath]);

  useEffect(() => {
    if (!categoryMap.length) {
      const categoryGroups = categoryItemsConfig.find(
        (item) => item.gameSlug === config.gameSlug
      )?.categoryGroups;

      categoryGroups.map(({members}) => {
        members.map(member => {
          setCategoryMap(prev => ([...prev, member]));
        })
      } )
    }
  });
  
  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      {loading ? (
        <Box display="block" top="100px !important" mt="300px">
          <Loader loading={loading} />
        </Box>
      ) : (
        <>
          <AppMap textOverlay={textOverlay} pathMarkers={pathMarkers} markerGroups={groups}/>
          <ProgressTracker markerGroups={groups}/>
        </>
      )}
    </>
  );
};

export default MapPage;
