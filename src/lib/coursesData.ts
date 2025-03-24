import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/firebase/clientApp";

export async function getCoursesData() {
  const summaryDoc = await getDoc(doc(db, 'summary', 'summary'));
  return summaryDoc.exists() ? summaryDoc.data().summary : {};
}
