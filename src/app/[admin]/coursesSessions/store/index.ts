import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Types
import { ICourse } from "@/app/common/types";
// Services
import { storageService } from "@/app/common/services";
// Schemas
import { toast } from "react-toastify";
import { courseSessionData } from "../schema";
// Repositories
import courseSessionRepo from "../repositories/courseSession";
// DTOS
import { CourseSessionDTO } from "../dtos/courseSessionDto";

interface CourseSessionState {
  isLoading: boolean;
  isLoadingNewSession: boolean;
  isDeletingSession: boolean;
  isLoadingUpdateSession: boolean;
  courses: ICourse[];
  fetchAll: () => Promise<void>;
  findCourseSessionByTitleOrDescription: (key: string) => Promise<void>;
  storeCourseSession: (CourseSessionDTO: courseSessionData) => Promise<void>;
  deleteCourseSession: (uid: string) => Promise<void>;
  updateCourseSession: (
    uid: string,
    CourseSessionDTO: courseSessionData
  ) => Promise<void>;
}

export const useCourseSessionStore = create<CourseSessionState>()((_set) => ({
  isLoading: true,
  isLoadingNewSession: false,
  isLoadingUpdateSession: false,
  isDeletingSession: false,
  courses: [],

  fetchAll: async () => {
    _set({ isLoading: true });
    try {
      const courses = await courseSessionRepo.getCoursesSessions();
      _set(() => ({ courses }));
    } catch (error) {
      console.error("Error when we tried to fetch all courses", error);
    } finally {
      _set({ isLoading: false });
    }
  },

  findCourseSessionByTitleOrDescription: async (key) => {
    _set({ isLoading: true });
    try {
      const courses =
        await courseSessionRepo.getCourseSessionByTitleOrDescription(key);
      _set(() => ({ courses }));
    } catch (error) {
      console.error("Error when we tried to search courses", error);
    } finally {
      _set({ isLoading: false });
    }
  },

  storeCourseSession: async (createCourseSessionData: courseSessionData) => {
    _set({ isLoadingNewSession: true });
    try {
      let remoteUrl = "";
      const file = createCourseSessionData.img as File;
      let remotePath = "";

      if (file) {
        remotePath = `/coursesSessions/${file.name}${uuidv4()}`;
        remoteUrl = await storageService.uploadFile(file, remotePath);
      }

      const result: CourseSessionDTO = {
        ...createCourseSessionData,
        img: remoteUrl,
        remotePath,
      };

      await courseSessionRepo.createCourseSession(result as CourseSessionDTO);
      toast.success("Sessão cadastrada!");
    } catch (error) {
      console.error("Error when we tried to store course session", error);
      toast.error("Ocorreu um erro ao cadastrar a sessão");
    } finally {
      _set({ isLoadingNewSession: false });
    }
  },

  updateCourseSession: async (
    uid: string,
    updateCourseSessionData: courseSessionData
  ) => {
    _set({ isLoadingNewSession: true });
    try {
      const previousCourseSessionData =
        (await courseSessionRepo.getCourseSessionByUid(uid)) as ICourse;
      const file = updateCourseSessionData.img as File;
      const remotePath =
        previousCourseSessionData.remotePath ||
        `/coursesSessions/${file.name}${uuidv4()}`;
      let remoteUrl = previousCourseSessionData.img;
      if (file instanceof File) {
        remoteUrl = await storageService.uploadFile(file, remotePath);
      }
      const result: CourseSessionDTO = {
        ...updateCourseSessionData,
        img: remoteUrl,
        uid: uid,
        remotePath,
      };

      await courseSessionRepo.updateCoursesSessions(
        uid,
        result as CourseSessionDTO
      );
      toast.success("Sessão atualizada!");
    } catch (error) {
      console.error("Error when we tried to update course session", error);
      toast.error("Ocorreu um erro ao atualizar a sessão");
    } finally {
      _set({ isLoadingNewSession: false });
    }
  },

  deleteCourseSession: async (uid: string) => {
    _set({ isDeletingSession: true });
    try {
      const previousCourseSessionData =
        await courseSessionRepo.getCourseSessionByUid(uid);
      const previousImgUrl = previousCourseSessionData?.img as string;
      if (previousImgUrl) {
        await storageService.deleteFile(previousImgUrl);
      }
      await courseSessionRepo.deleteCourseSession(uid);
      toast.success("Sessão deletada!");
    } catch (error) {
      console.error("Error when we tried to remove session", error);
    } finally {
      _set({ isDeletingSession: false });
    }
  },
}));
