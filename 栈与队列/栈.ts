import { LinkList } from "../线性表/双向缓冲链表";

// 栈
// 先进后出
// 封装双向链表
export class Stack extends LinkList<any>{
    constructor(){
        super();
    }
    
    push(data){
        this.insert(data, 0);
    }
    
    pop(){
        super.pop(false);
    }

    get(){
        return super.get(0);
    }
}