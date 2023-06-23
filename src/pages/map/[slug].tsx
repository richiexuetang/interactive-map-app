import React, { useEffect } from "react";
import { NextSeo } from "next-seo";

import { categoryItemsConfig, mapConfig, areaConfig } from "@data/config";
import { useMapContext } from "@context/app-context";
import AppMap from "@components/Map/AppMap";
import { Loader } from "@components/Loader";
import { useLoading } from "@hooks/useLoading";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";

export async function getStaticProps(context) {
  const areaId = context.params.slug;

  const config = areaConfig.find((o) => o.name === areaId);

  const all = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/area/${areaId}`
  );

  const locations = await all.json();

  const textOverlay = locations.filter((item) => item.markerTypeId === 2);
  const pathMarkers = locations.filter((item) => item.markerTypeId === 4);

  const categoryCounts = {};

  pathMarkers.map(({ categoryId }) => {
    categoryCounts[categoryId] = categoryCounts[categoryId] + 1 || 1;
  });

  let locationGroups = [];
  const categoryConfig = categoryItemsConfig.find((item) =>
    item.mapSlugs.includes(areaId)
  );
  
  categoryConfig.categoryGroups.map(({ name, members, groupType }) => {
    members.map((item) => {
      const positions = locations
        .map((el, i) => (el.categoryId === item ? i : undefined))
        .filter((x) => x);
      if (positions.length) {
        locationGroups.push({
          group: name,
          ranks: [...positions],
          categoryId: item,
          markerTypeId: groupType,
        });
        categoryCounts[item] = positions.length;
      }
    });
  });

  return {
    props: {
      config,
      categoryCounts,
      textOverlay,
      pathMarkers,
      locations,
      locationGroups
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
  locations,
  locationGroups
}) => {
  const { asPath } = useRouter();
  const [loading] = useLoading();

  const { setConfig, setCategoryCounts, categoryMap, setCategoryMap } =
    useMapContext();

  useEffect(() => {
    setConfig(config);
    setCategoryCounts(categoryCounts);
  }, [asPath]);

  useEffect(() => {
    if (!categoryMap.length) {
      const categoryGroups = categoryItemsConfig.find(
        (item) => item.gameSlug === config.gameSlug
      )?.categoryGroups;

      categoryGroups.map(({ members }) => {
        members.map((member) => {
          setCategoryMap((prev) => [...prev, member]);
        });
      });
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
        <AppMap
          textOverlay={textOverlay}
          pathMarkers={pathMarkers}
          locations={locations}
          locationGroups={locationGroups}
        />
      )}
    </>
  );
};

export default MapPage;
