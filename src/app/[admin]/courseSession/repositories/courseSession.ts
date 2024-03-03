//Firebase
import {
  doc,
  setDoc,
  collection,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  or,
} from "firebase/firestore";

import { db } from "../../../config/firebase";

// DTOS
import { CourseSessionDTO } from "../dtos/courseSessionDto";

// Types
import { ICourse } from "@/app/common/types";

// Collection Reference
const courseSessionCollectionRef = collection(db, "coursesSessions");

class CourseSessionRepo {
  constructor() {}

  private getDocRef(uid?: string) {
    if (uid) return doc(courseSessionCollectionRef, uid);
    return doc(courseSessionCollectionRef);
  }

  async createAnswer(courseSessionDto: CourseSessionDTO) {
    try {
      const newCourseSessionRef = this.getDocRef();
      await setDoc(newCourseSessionRef, {
        ...courseSessionDto,
        uid: newCourseSessionRef.id,
      });
    } catch (error) {
      console.error("Error when we tried to create course session", error);
    }
  }

  async getCourseSessionByUid(uid: string) {
    const courseSessionRef = this.getDocRef(uid);
    const result = await getDoc(courseSessionRef);
    if (!result.exists) return null;
    return result.data() as ICourse;
  }

  async getCourseSessionByTitleOrDescription(key: string) {
    try {
      const result = query(
        courseSessionCollectionRef,
        or(
          where("title", "array-contains", key),
          where("description", "array-contains", key)
        )
      );

      const querySnapshot = await getDocs(result);
      if (querySnapshot.empty) return [];
      const coursesSession: ICourse[] = [];
      querySnapshot.forEach((doc) =>
        coursesSession.push(doc.data() as ICourse)
      );
      return coursesSession;
    } catch (error) {
      console.error("Error when we tried to search courses sessions", error);
    }
  }

  async getCoursesSessions() {
    try {
      const coursesSessionsSnapshot = await getDocs(courseSessionCollectionRef);
      if (coursesSessionsSnapshot.empty) return [] as ICourse[];
      const coursesSessions: ICourse[] = [];
      coursesSessionsSnapshot.forEach((doc) => {
        coursesSessions.push(doc.data() as ICourse);
      });
      return coursesSessions;
    } catch (error) {
      console.error("Error when we tried to get courses sessions", error);
    }
  }

  async updateCoursesSessions(
    uid: string,
    updateCourseSessionDto: CourseSessionDTO
  ) {
    try {
      const courseSessionRef = this.getDocRef(uid);
      await setDoc(courseSessionRef, updateCourseSessionDto);
    } catch (error) {
      console.error("Error when we tried to update course session", error);
    }
  }

  async deleteCoursesSessions(uid: string) {
    try {
      const courseSessionRef = this.getDocRef(uid);
      await deleteDoc(courseSessionRef);
    } catch (error) {
      console.error("Error when we tried to delete course session", error);
    }
  }
}

const courseSessionRepo = new CourseSessionRepo();

export default courseSessionRepo;
