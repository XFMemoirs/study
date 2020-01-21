// 环形队列
export class RingQueue{
    data = []; // 可以是数组 或者 链表
    front = 0; // 队列头
    rear = 0; // 队列尾
    useLength = 0; // 使用长度
    _length = 0; // 队列长度

    // init_len: 初始化长度
    constructor(init_len = 16){
        this._length = 16;
    }

    // 入队列
    push(data){
        let next = (this.rear + 1) % this._length;
        if (next == this.front){
            return;
        }
        this.rear = next;
        this.data[next] = data;
    }

    // 出队列
    pop(){
        if (this.useLength <= 0){
            return;
        }
        let data = this.data[this.front];
        this.useLength--;
        this.front++;
        this.front %= this._length;
        return data;
    }

    // 获取队头
    getFront(){
        return this.data[this.front];
    }

    // 获取队尾
    getRear(){
        return this.data[this.rear];
    }

    // 获取长度
    get length(){
        return this.useLength;
    }

    // 扩容 (耗时操作)
    dilatation(num: number){
        if (this.useLength > 0){
            let new_data = [];
            let index = this.front;
            let i = 0;
            while(index != this.rear){
                new_data[i] = this.data[index];
                index++;
                index %= this._length;
                i++;
            }
            new_data.push(this.data[this.rear]);
            this.data = new_data;
        }
        this._length += num;
    }
}