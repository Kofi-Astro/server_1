const express = require('express');
const router = express.Router();

const UserController = require('./controllers/userController');
const ChatController = require('./controllers/chatController');

const userMiddleware = require('./middlewares/auth/user');

const middlewares = {
	user: userMiddleware
}
 
router.get('/', (req, res) => {
	return res.json({
		warn: 'me',
	})
});

router.post('/auth', UserController.login);

router.post('/user', UserController.create);

router.get('/users', [middlewares.user], UserController.getUsers);

router.get('/chats', [middlewares.user], ChatController.getChats);

router.get('/chats/user/:userId', [middlewares.user], ChatController.getChatByUserId);
router.post('/chats/:chatId/message', [middlewares.user], ChatController.sendMessage);
router.post('/chats/:chatId/read', [middlewares.user], ChatController.readChat);


module.exports = router;






















































// const express = require('express');
// const router = express.Router();
// const multer = require("multer");

// const storage= multer.diskStorage({destination: (req, file, cb)=>{
// 	cb(null, './uploads');
// },
// filename:(req, file, cb)=>{
// 	cb(null, Date.now()+'.jpg')
// },
// })


// const upload = multer({
// 	storage: storage,
// });

// router.route('/addimage').post(upload.single('img'),(req, res)=>{
// 	try {
// res.json({path: req.file.filename,})
		
// 	} catch (error) {
// 		return res.json({error:error});
// 	}
// });

// module.exports = router;