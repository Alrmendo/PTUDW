import express from 'express';
const router = express.Router();
import SearchController from '../controllers/SearchController.js';

router.get('/', SearchController.loadSearch);

export default router;