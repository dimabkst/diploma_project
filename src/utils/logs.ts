import { LogLevel } from '@prisma/client';
import { maskSensitiveData } from './data';
import prisma from '../db';

export const saveLog = async (data: { message: string; level: LogLevel; status?: number; context?: any }) => {
  const maskedData = maskSensitiveData(data);

  await prisma.log.create({
    data: {
      ...maskedData,
      context: maskedData.context || undefined,
    },
    select: { id: true },
  });
};
