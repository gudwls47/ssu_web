import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase/db";

export const fetchFestivals = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "festivals"));

    const festivalList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(festivalList);
    return festivalList;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
};
