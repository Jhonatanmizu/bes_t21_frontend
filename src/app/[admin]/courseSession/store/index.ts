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
  findByAnswerOrDescription: (key: string) => Promise<void>;
  storeAnswer: (CourseSessionDTO: courseSessionData) => Promise<void>;
  deleteAnswer: (uid: string) => Promise<void>;
  updateAnswer: (
    uid: string,
    CourseSessionDTO: courseSessionData
  ) => Promise<void>;
}

export const useAnswerStore = create<CourseSessionState>()((_set) => ({
  isLoadingNewAnswer: false,
  isLoading: true,
  isLoadingNewSession: false,
  isLoadingUpdateSession: false,
  isDeletingSession: false,
  courses: [],

  fetchAll: async () => {
    _set({ isLoading: true });
    try {
      const answers = await courseSessionRepo.getAnswers();
      _set(() => ({ answers }));
    } catch (error) {
      console.error("Error when we tried to fetch all answers", error);
    } finally {
      _set({ isLoading: false });
    }
  },

  findByAnswerOrDescription: async (key) => {
    _set({ isLoading: true });
    try {
      const answers = await courseSessionRepo.getAnswersByTitleOrDescription(
        key
      );
      _set(() => ({ answers }));
    } catch (error) {
      console.error("Error when we tried to search answers", error);
    } finally {
      _set({ isLoading: false });
    }
  },

  storeAnswer: async (createcourseSessionData: courseSessionData) => {
    _set({ isLoadingNewAnswer: true });
    try {
      let remoteUrl = "";
      const file = createcourseSessionData.img as File;
      if (file) {
        remoteUrl = await storageService.uploadFile(
          file,
          `/answers/${file.name}${uuidv4()}`
        );
      }

      const result: CourseSessionDTO = {
        ...createcourseSessionData,
        img: remoteUrl,
      };

      await courseSessionRepo.createAnswer(result as CourseSessionDTO);
      toast.success("Resposta cadastrada!");
    } catch (error) {
      console.error("Error when we tried to store answer", error);
      toast.error("Ocorreu um erro ao cadastrar a resposta");
    } finally {
      _set({ isLoadingNewAnswer: false });
    }
  },

  updateAnswer: async (
    uid: string,
    updatecourseSessionData: courseSessionData
  ) => {
    _set({ isLoadingNewAnswer: true });
    try {
      let remoteUrl = "";
      const file = updatecourseSessionData.img as File;
      if (file) {
        const previouscourseSessionData =
          await courseSessionRepo.getAnswerByUid(uid);
        const previousImgUrl = previouscourseSessionData?.img as string;
        await storageService.deleteFile(previousImgUrl);
        remoteUrl = await storageService.uploadFile(
          file,
          `/answers/${file.name}${uuidv4()}`
        );
      }

      const result: CourseSessionDTO = {
        ...updatecourseSessionData,
        img: remoteUrl,
        uid: uid,
      };

      await courseSessionRepo.updateAnswer(uid, result as CourseSessionDTO);
      toast.success("Resposta atualizada!");
    } catch (error) {
      console.error("Error when we tried to update answer", error);
      toast.error("Ocorreu um erro ao atualizar a resposta");
    } finally {
      _set({ isLoadingNewAnswer: false });
    }
  },

  deleteAnswer: async (uid: string) => {
    _set({ isDeletingAnswer: true });
    try {
      const previouscourseSessionData = await courseSessionRepo.getAnswerByUid(
        uid
      );
      const previousImgUrl = previouscourseSessionData?.img as string;
      if (previousImgUrl) {
        await storageService.deleteFile(previousImgUrl);
      }
      await courseSessionRepo.deleteAnswer(uid);
      toast.success("Resposta deletada!");
    } catch (error) {
      console.error("Error when we tried to remove answer", error);
    } finally {
      _set({ isDeletingAnswer: false });
    }
  },
}));
