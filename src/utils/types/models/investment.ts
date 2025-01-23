import { Types } from "mongoose";

export interface InvestmentModelType {
    type: "CDB" | "poupanca" | "acao" | "fundo" | "tesouro" | "cripto" | "outro";
    yieldFrequency: "diario" | "semanal" | "mensal";
    riskLevel: "baixo" | "moderado" | "alto";
    spaceID: Types.ObjectId;
    ownerID: Types.ObjectId;
    maxInvestment?: number;
    minInvestment: number;
    attachments: string[];
    interestRate: number;
    isRecurring: boolean;
    penaltyRate: number;
    description: string;
    createdAt?: Date;
    lastUpdate?: Date;
    duration: number;
    name: string;
    _id: string;
}
