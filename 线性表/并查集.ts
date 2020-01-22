/**
 * 参考网站: https://blog.csdn.net/niushuai666/article/details/6662911
 * 应用场景: 现有城市每个区的交通道路图 得到还需要修多少路 能实现全城道路贯通
 *          也就是求要合并多少次才能实现贯通
 * 核心是2个函数 查找和合并
 * 个人理解并查集是将树形结构扁平化后的一种数据结构 最终可以用线性表来表示
 * 但并查集的前提是每一个节点相对于全局都有自己独立的id
*/

// 并查集
export class UnionFind{
    // 每个街道有自己的独立id 根节点的id就是自己
    parents = [];

    constructor(){}

    // 添加
    // id: 自己的唯一id
    // parent_id: 所属节点的id
    add(id: number, parent_id: number){
        this.parents[id] = parent_id;
    }

    // 查找所属节点
    find(id: number){
        
        let save = id;
        let temp;
        while(id != this.parents[id]){
            id = this.parents[id];
        }

        // 路径压缩
        // 当前节点不是根节点 则把当前和上面的所有节点 归并直属到根节点下 便于下次查找
        while(save != id){
            temp = this.parents[save];
            this.parents[save] = id;
            save = temp;
        }

        return id;
    }

    // 合并2个节点
    join(id1, id2){
        // 当前2个节点是否同属于一个根节点
        let p1 = this.find(id1);
        let p2 = this.find(id2);
        // 默认将1归属于2
        if (p1 != p2){
            this.parents[p1] = p2;
        }
    }
}