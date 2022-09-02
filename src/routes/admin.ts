import express, {Request, Response, Router} from 'express';
import checkAuth from "../util/auth/checkAuth";
import { ADMINS, CSRF_COOKIE_OPTIONS } from "../util/constants/constants";
import csurf from "csurf";
import errorNotifier from "../util/errorNotifier";

const router: Router = express.Router();

router.use(csurf({ cookie: CSRF_COOKIE_OPTIONS }));
router.use(checkAuth);
router.use((req, res, next) => {
	if(!ADMINS.includes(String(req.user.litauthId))) {
		errorNotifier(`User ${req.user.litauthId} (${req.user.username}) tried to access the admin panel.`, JSON.stringify({user: req.user, url: req.originalUrl, method: req.method, query: req?.query, headers: req?.headers}), "Vukkybox Admin Access Alert");
		return res.status(403).render('error', {title: "Vukkyboxn't", error: "403 Forbidden<br> You are not an administrator. This incident will be reported."});
	}
	res.locals.csrfToken = req.csrfToken();
	next();
})

router.get('/', (req: Request, res: Response) => {
	return res.render('admin', {title: "Vukkybox - Admin"});
});

router.post('/giveall', (req: Request, res: Response) => {
	let allRarities = Object.keys(req.app.locals.vukkies.rarity);
	let allVukkyIds = [];
	allRarities.forEach(rarity => {
		allVukkyIds = allVukkyIds.concat(Object.keys(req.app.locals.vukkies.rarity[rarity]));
	})
	let allVukkies = {};
	allVukkyIds.forEach(vukkyId => {
		allVukkies[vukkyId] = 999;
	})
	res.locals.user.playerData.collection = allVukkies;
	res.locals.user.save();
	res.send("Successfully gave all vukkies to user");
})

export default router;