import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Cycle } from "../types";

const COLLECTION_NAME = "user_cycles";

export const loadUserCycle = async (userId: string): Promise<Cycle | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Cycle;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading user cycle:", error);
    return null;
  }
};

export const saveUserCycle = async (userId: string, cycle: Cycle): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await setDoc(docRef, cycle, { merge: true });
  } catch (error) {
    console.error("Error saving user cycle:", error);
  }
};
