import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FestivalResponse, GetFestivalsParams } from "./festivals.type";
import { db } from "../utils/firebase/db";

export const useGetFestivals = (params: GetFestivalsParams) => {
  return useQuery({
    queryKey: ["festivals", params],
    queryFn: async () => {
      let queryBuilder = query(collection(db, "festivals"));

      if (params.status) {
        queryBuilder = query(
          queryBuilder,
          where("status", "==", params.status),
        );
      }

      queryBuilder = query(
        queryBuilder,
        orderBy("createdAt", params.orderByCreatedTimestamp || "desc"),
      );
      queryBuilder = query(queryBuilder, limit(params.size || 10));

      const querySnapshot = await getDocs(queryBuilder);

      const festivalList: FestivalResponse[] = querySnapshot.docs.map(
        (doc) => ({
          ...(doc.data() as FestivalResponse),
          id: doc.id,
        }),
      );

      return festivalList;
    },
    refetchInterval: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  });
};

export const useGetFestival = (id: string) => {
  return useQuery({
    queryKey: ["festival", id],
    queryFn: async () => {
      const docRef = doc(db, "festivals", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Festival not found");
      }
      return docSnap.data() as FestivalResponse;
    },
    enabled: Boolean(id),
  });
};
