// 节点
class LNode<T>{
    next: LNode<T>;
    pre: LNode<T>;
    data: T;
}

// 初始化缓存长度
const INIT_CACHE_LEN = 20;

// 双向缓冲链表
export class LinkList<T>{
    private useLen: number = 0;
    private cacheLen: number = 0;
    private useHead: LNode<T> = new LNode<T>();
    private cacheHead: LNode<T> = new LNode<T>();
    private iter: LNode<T>;
    private addCacheLen = INIT_CACHE_LEN;

    constructor(cache_len: number = INIT_CACHE_LEN){
        let head = this.useHead;
        head.pre = head;
        head.next = head;
        
        head = this.cacheHead;
        head.pre = head;
        head.next = head;

        this.dilatation(cache_len);

        this.iter = this.useHead.next;
    }

    push(data: T){
        let head = this.useHead;
        let node = this.getCacheNode();
        node.data = data;
        node.next = head;
        node.pre = head.pre;
        head.pre.next = node;
        head.pre = node;
        this.useLen++;
    }

    // 删除
    // last: true: 删除尾部 false: 删除头部  
    pop(last = true){
        if (this.useLen <= 0){
            return;
        }
        
        let use_head = this.useHead;
        let n;
        if (last){
            n = use_head.pre;
            n.pre.next = use_head;
            use_head.pre = n.pre;
        }
        else{
            n = use_head.next;
            use_head.next = n.next;
            n.next.pre = use_head;
        }

        let cache_head = this.cacheHead;
        n.next = cache_head;
        n.pre = cache_head.pre;
        cache_head.pre.next = n;
        cache_head.pre = n;

        this.useLen--;
        this.cacheLen++;
    }

    // 插入
    // data: 数据
    // index: 插入位置
    insert(data: T, index: number){
        if (this.useLen == index){
            this.push(data);
            return;
        }

        let n = this.getNode(index);
        if (!n){
            return;
        }

        let new_node = this.getCacheNode();
        new_node.data = data;
        new_node.pre = n.pre;
        new_node.next = n;
        n.pre.next = new_node;
        n.pre = new_node;
        this.useLen++;
    }
    
    // 清空
    clear(){
        if (this.useLen <= 0){
            return;
        }
        
        let use_first = this.useHead.next;
        let use_last = this.useHead.pre;
        let cache_head = this.cacheHead;
        let cache_last = this.cacheHead.pre;

        use_first.pre = cache_last;
        use_last.next = cache_head;
        cache_last.next = use_first;
        cache_head.pre = use_last;

        this.useHead.pre = this.useHead;
        this.useHead.next = this.useHead;
        
        this.cacheLen += this.useLen;
        this.useLen = 0;
    }

    // 长度
    get length(): number{
        return this.useLen;
    }

    // 获取数据
    // index: 下标
    get(index: number): T{
        let n = this.getNode(index);
        return n && n.data;
    }

    // 删除数据
    // index: 下标
    erase(index: number){
        let n = this.getNode(index);
        if (!n){
            return;
        }

        n.pre.next = n.next;
        n.next.pre = n.pre;
        let cache_last = this.cacheHead.pre;
        n.pre = cache_last;
        n.next = this.cacheHead;
        this.cacheHead.pre = n;
        cache_last.next = n;

        this.useLen--;
        this.cacheLen++;
    }

    // 获取迭代器
    get iterator(){
        return this.iter;
    }

    // 迭代器指向开始
    begin(){
        return this.useHead.next;
    }

    // 迭代器指向结束
    end(){
        return this.useHead;
    }

    // 遍历
    foreach(cb: (index, value)=>void){
        let n = this.useHead;
        for (let i = 0; i < this.useLen; ++i){
            n = n.next;
            cb(i, n.data);
        }
    }

    // 获取使用节点
    private getNode(index: number): LNode<T>{
        if (index < 0 || index >= this.useLen){
            return null;
        }

        let n: LNode<T> = this.useHead;
        // 折半查找
        let half = Math.floor(this.useLen / 2);

        if (index < half){
            for (let i = 0; i <= index; ++i){
                n = n.next;
            }
        }
        else{
            for (let i = this.useLen - 1; i >= index; --i){
                n = n.pre;
            }
        }

        return  n;
    }

    // 获取缓存节点
    private getCacheNode(): LNode<T>{
        if (this.cacheLen <= 0){
            this.dilatation();
        }

        let head = this.cacheHead;
        let n = head.pre;
        n.pre.next = head;
        head.pre = n.pre;
        this.cacheLen--;

        return n;
    }

    // 扩容
    private dilatation(len: number = this.addCacheLen){
        let head = this.cacheHead;
        for (let i = 0; i < len; ++i){
            let cache = new LNode<T>();
            cache.next = head;
            cache.pre = head.pre;
            head.pre.next = cache;
            head.pre = cache;
            this.cacheLen++;
        }

        // 增加下次扩容长度
        this.addCacheLen += len;
    }
}