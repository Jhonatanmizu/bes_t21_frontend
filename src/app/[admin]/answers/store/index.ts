import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Types
import { IAnswer } from "@/app/common/types";
// Services
import { storageService } from "@/app/common/services";
// Schemas
import { toast } from "react-toastify";
import { answerData } from "../schema";
// Repositories
import answerRepo from "../repositories/answerRepo";
// DTOS
import { CreateAnswerDTO, UpdateAnswerDto } from "../dtos/answerDto";

interface AnswerState {
  isLoading: boolean;
  isLoadingNewAnswer: boolean;
  isDeletingAnswer: boolean;
  isLoadingUpdateAnswer: boolean;
  answers: IAnswer[];
  fetchAll: () => Promise<void>;
  findByAnswerOrDescription: (key: string) => Promise<void>;
  storeAnswer: (createAnswerDto: answerData) => Promise<void>;
  deleteAnswer: (uid: string) => Promise<void>;
  updateAnswer: (uid: string, UpdateAnswerDto: answerData) => Promise<void>;
}

export const useAnswerStore = create<AnswerState>()((_set) => ({
  isLoadingNewAnswer: false,
  isLoading: true,
  isDeletingAnswer: false,
  isLoadingUpdateAnswer: false,
  answers: [],

  fetchAll: async () => {
    _set({ isLoading: true });
    try {
      const answers = await answerRepo.getAnswers();
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
      const answers = await answerRepo.getAnswersByTitleOrDescription(key);
      _set(() => ({ answers }));
    } catch (error) {
      console.error("Error when we tried to search answers", error);
    } finally {
      _set({ isLoading: false });
    }
  },

  storeAnswer: async (createAnswerData: answerData) => {
    _set({ isLoadingNewAnswer: true });
    try {
      let remoteUrl = "";
      const file = createAnswerData.img as File;
      let remotePath = "";

      if (file) {
        remotePath = `/answers/${file.name}${uuidv4()}`;
        remoteUrl = await storageService.uploadFile(file, remotePath);
      }

      const result: CreateAnswerDTO = {
        ...createAnswerData,
        img: remoteUrl,
        remotePath,
      };

      await answerRepo.createAnswer(result as CreateAnswerDTO);
      toast.success("Resposta cadastrada!");
    } catch (error) {
      console.error("Error when we tried to store answer", error);
      toast.error("Ocorreu um erro ao cadastrar a resposta");
    } finally {
      _set({ isLoadingNewAnswer: false });
    }
  },

  updateAnswer: async (uid: string, updateAnswerData: answerData) => {
    _set({ isLoadingNewAnswer: true });
    try {
      const previousAnswerData = (await answerRepo.getAnswerByUid(
        uid
      )) as IAnswer;
      const file = updateAnswerData.img as File;
      const remotePath =
        previousAnswerData.remotePath || `/answers/${file.name}${uuidv4()}`;
      let remoteUrl = previousAnswerData.img;
      if (file instanceof File) {
        remoteUrl = await storageService.uploadFile(file, remotePath);
      }
      const result: UpdateAnswerDto = {
        ...updateAnswerData,
        img: remoteUrl,
        uid: uid,
        remotePath,
      };

      await answerRepo.updateAnswer(uid, result as UpdateAnswerDto);
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
      const previousAnswerData = await answerRepo.getAnswerByUid(uid);
      const previousImgUrl = previousAnswerData?.img as string;
      if (previousImgUrl) {
        await storageService.deleteFile(previousImgUrl);
      }
      await answerRepo.deleteAnswer(uid);
      toast.success("Resposta deletada!");
    } catch (error) {
      console.error("Error when we tried to remove answer", error);
    } finally {
      _set({ isDeletingAnswer: false });
    }
  },
}));
