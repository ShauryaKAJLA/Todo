import { Router } from "express";
import { addTodo, deleteTodo, getAllTodos } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router=Router()

router.route('/getAllTodo').get(verifyJWT,getAllTodos)
router.route('/addTodo').post(verifyJWT,addTodo)
router.route('/deleteTodo').delete(verifyJWT,deleteTodo)

export default router