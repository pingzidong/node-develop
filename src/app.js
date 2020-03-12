const express = require('express')

const app = new express()

const models = require('../db/models');

const bodyParser = require('body-parser');

// 使用中间件
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/list/:status/:page',async (req,res,next) => {
    res.json({
        list: []
    })
})

app.post('/create',async (req,res,next)=>{
    try {
        let { name, deadline, content } = req.body;
        let todo = await models.Todo.create({
            name,
            deadline,
            content
        })
        res.json({
            todo,
            message: '创建成功'
        }) 
    }catch(error){
        next(error);
    }
})

app.post('/update',async (req,res,next)=>{
    try {
        let { name,deadline,content,id} = req.body 
        let todo = await models.Todo.findOne({
            where:{
                id
            }
        })
        if(todo){
            todo = await models.Todo.update({
                name,
                deadline,
                content
            })
        }
        res.json({
            todo
        })
    }catch(error){
        next(error)
    }
})

// 使用中间件来统一报错返回格式,全局捕获
app.use((err, req,res, next)=>{
    if(err){
        res.status(500).json({
            message: err.message
        })
    }
}) 

app.listen(3000,()=> {
    console.log('服务启动成功');
})