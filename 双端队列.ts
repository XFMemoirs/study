import { LinkList } from "./双向缓冲链表";

// 双端队列
// 参考: https://www.jianshu.com/p/1f1520db325d
// 就是一个2端都可以进出的队列而已
// 封装双向链表
export class Deque extends LinkList<any>{
    constructor(){
        super();
    }
    
    // 从队头入队
    pushFront(data){
        this.insert(data, 0);
    }

    // 从队尾入队
    pushRear(data){
        this.push(data);
    }

    // 从队头删除
    popFront(){
        this.pop(false);
    }

    // 从队尾删除
    popRear(){
        this.pop(true);
    }
}