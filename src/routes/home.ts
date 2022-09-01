import express, { Request, Response, Router } from 'express';
import csurf from "csurf";
import db from '../databaseManager';
import checkAuth from "../util/auth/checkAuth";
const router : Router = express.Router();

router.use(csurf({ cookie: true }));

router.get('/', (req : Request, res : Response) => {
	res.render('index', {title: "Vukkybox"});
});

router.get('/test', (req : Request, res : Response) => {
	res.render('test', {title: "Vukkybox"});
});

router.get('/open/:id', checkAuth, (req : Request, res : Response) => {
	let realBoxIds = req.app.locals.boxes.map((box) => box.id);
	if (!realBoxIds.includes(parseInt(req.params.id))) return res.status(404).render('error', {title: "Vukkyboxn't", error: "Box not found"});
	let boxPrice = req.app.locals.boxes.find((box) => box.id === parseInt(req.params.id)).price;
	if (req.user.playerData.balance < boxPrice) return res.status(403).render('error', {title: "Vukkyboxn't", error: "You do not have enough money to open this box"});
	res.render('open', {title: "Vukkybox", boxId: req.params.id});
});

router.get('/collection', checkAuth, (req : Request, res : Response) => {
	if (!req?.query?.user) {
		res.render('collection', {title: "Vukkybox", sortingMethod: req?.query?.sortingMethod});
	} else {
		let User = db.getUsers();
		User.findOne({_id: req.query.user}, (err, user) => {
			if (err || !user) return res.render('collection', {title: "Vukkybox", sortingMethod: req?.query?.sortingMethod});
			res.render('collection', {title: "Vukkybox", sortingMethod: req?.query?.sortingMethod, user});

		})
	}
});

export default router;