import mongoose from "mongoose";
import {playerDataModel, IplayerDataModel} from "./playerDataModel";
import {statisticsModel, IstatisticsModel} from "./statisticsModel";

interface IUser {
	_id: mongoose.Types.ObjectId,
	litauthId: mongoose.Types.ObjectId,
	username: String,
	email: String,
	mfa?: Boolean,
	mfasecret?: String,
	apiKey?: String,
	playerData?: IplayerDataModel,
	statistics?: IstatisticsModel,
	createdAt: Date,
	profile: {
		background: {
			mode: String,
			color?: String,
			image?: String
		},
		order: Array<String>
	},
	flags: Array<{flag: number, date: Date, reason?: string}>
}

const UserSchema = {
	litauthId: mongoose.Types.ObjectId,
	username: String,
	email: String,
	mfa: Boolean,
	mfasecret: String,
	apiKey: String,
	playerData: playerDataModel,
	statistics: statisticsModel,
	createdAt: Date,
	profile: {
		background: {
			mode: String,
			color: String,
			image: String
		},
		order: Array<String>
	},
	flags: Array<{flag: number, date: Date, reason: string}>

}

export { IUser, UserSchema }