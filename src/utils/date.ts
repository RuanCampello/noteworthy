import { Timestamp } from "firebase/firestore";

export function timestampToLocateDate(timestamp: Timestamp): string {
  const localeDateString = new Date(timestamp.seconds*1000).toLocaleDateString('en-GB')
  return localeDateString
}