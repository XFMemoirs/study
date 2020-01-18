#ifndef _LINK_LIST_H_
#define _LINK_LIST_H_
#include <stdint.h>

#define INIT_CACHE_LEN 16 // 初始化默认缓存长度
#define DILATATION_LEN 8 // 扩容长度

// 链表
template <typename T>
class Linklist
{
public:
	// 节点
	typedef struct ListNode
	{
		ListNode* mPre;
		ListNode* mNext;
		T mData;
	}Ln;

public:
	Linklist(int32_t cache_len = INIT_CACHE_LEN);

	Linklist(const Linklist& other);

	~Linklist(void);

	T& operator [] (int32_t index);

	Linklist& operator = (const Linklist& other);

	Linklist& operator += (const Linklist& other);

	// 推入
	bool Push(T data);

	// 弹出
	bool Pop(void);

	// 插入
	bool Insert(T data, int32_t index);

	// 清空
	void Clear(void);

	// 删除
	bool Erase(int32_t index);

	// 长度
	int32_t Length(void) const;

	// 获取数据
	T& GetData(int32_t index) const;

protected:
	// 扩容
	void Dilatation(int32_t dilatation_len = DILATATION_LEN);

	// 获取缓存
	Ln* GetCacheNode(bool cut = false);

	// 获取节点
	Ln* GetUseNode(int32_t index) const;

private:
	void InitUseHead(void);

	void InitCacheHead(void);

private:
	Ln* mUseHead;
	Ln* mCacheHead;
	int32_t mUseLen;
	int32_t mCacheLen;
};

template <typename T>
void Linklist<T>::InitUseHead(void)
{
	// 使用头
	mUseHead = new Ln;
	mUseHead->mPre = mUseHead;
	mUseHead->mNext = mUseHead;
	mUseLen = 0;
}

template <typename T>
void Linklist<T>::InitCacheHead(void)
{
	// 缓存头
	mCacheHead = new Ln;
	mCacheHead->mPre = mCacheHead;
	mCacheHead->mNext = mCacheHead;
	mCacheLen = 0;
}

template <typename T>
Linklist<T>::Linklist(int32_t cache_len)
{
	InitUseHead();
	InitCacheHead();
	// 扩容
	if (cache_len > 0)
	{
		Dilatation(cache_len);
	}
}

template <typename T>
Linklist<T>::Linklist(const Linklist& other)
{
	InitUseHead();
	InitCacheHead();

	auto len = other.Length();
	if (len > 0)
	{
		for (int32_t i = 0; i < len; ++i)
		{
			Push(other.GetData(i));
		}
	}
}

template <typename T>
Linklist<T>& Linklist<T>::operator = (const Linklist& other)
{
	if (&other != this)
	{
		auto len = other.Length();
		if (len > 0)
		{
			Clear();
			for (int32_t i = 0; i < len; ++i)
			{
				Push(other.GetData(i));
			}
		}
	}
	return *this;
}

template <typename T>
Linklist<T>& Linklist<T>::operator += (const Linklist& other)
{
	if (&other != this)
	{
		auto len = other.Length();
		if (len > 0)
		{
			for (int32_t i = 0; i < len; ++i)
			{
				Push(other.GetData(i));
			}
		}
	}
	return *this;
}

template <typename T>
T& Linklist<T>::operator [] (int32_t index)
{
	return GetData(index);
}

template <typename T>
Linklist<T>::~Linklist(void)
{
	Clear();
	auto cur = mCacheHead;
	auto next = cur->mNext;
	for (int32_t i = 0; i < mCacheLen; ++i)
	{
		cur = next;
		next = next->mNext;
		delete cur;
		cur = nullptr;
	}
	delete mUseHead;
	delete mCacheHead;
}

template <typename T>
bool Linklist<T>::Push(T data)
{
	Ln* node = GetCacheNode(true);
	node->mData = data;
	node->mNext = mUseHead;
	node->mPre = mUseHead->mPre;
	mUseHead->mPre->mNext = node;
	mUseHead->mPre = node;

	++mUseLen;
	--mCacheLen;
	return true;
}

template <typename T>
bool Linklist<T>::Pop(void)
{
	if (mUseLen <= 0)
	{
		return false;
	}
	auto node = mUseHead->mPre;
	mUseHead->mPre = node->mPre;
	mUseHead->mPre->mNext = mUseHead;
	node->mNext = mCacheHead;
	node->mPre = mCacheHead->mPre;
	mCacheHead->mPre->mNext = node;
	mCacheHead->mPre = node;

	--mUseLen;
	++mCacheLen;
	return true;
}

template <typename T>
bool Linklist<T>::Insert(T data, int32_t index)
{
	Ln* use_node = GetUseNode(index);
	if (!use_node)
	{
		return false;
	}
	Ln* cache = GetCacheNode(true);
	cache->mPre = use_node->mPre;
	cache->mNext = use_node;
	cache->mData = data;
	use_node->mPre->mNext = cache;
	use_node->mPre = cache;

	++mUseLen;
	--mCacheLen;
	return true;
}

template <typename T>
void Linklist<T>::Clear(void)
{
	mCacheLen += mUseLen;
	mUseLen = 0;

	auto node = mUseHead->mNext;
	node->mPre = mUseHead->mPre;
	node->mPre->mNext = node;
	mUseHead->mPre = mUseHead;
	mUseHead->mNext = mUseHead;

	auto cache_last = mCacheHead->mPre;
	auto node_last = node->mPre;
	node->mPre = cache_last;
	node_last->mNext = mCacheHead;
	mCacheHead->mPre = node_last;
	cache_last->mNext = node;
}

template <typename T>
bool Linklist<T>::Erase(int32_t index)
{
	auto node = GetUseNode(index);
	if (!node)
	{
		return false;
	}

	node->mPre->mNext = node->mNext;
	node->mNext->mPre = node->mPre;
	node->mPre = mCacheHead->mPre;
	node->mNext = mCacheHead;
	mCacheHead->mPre->mNext = node;
	mCacheHead->mPre = node;

	--mUseLen;
	++mCacheLen;
	return true;
}

template <typename T>
int32_t Linklist<T>::Length(void) const
{
	return mUseLen;
}

template <typename T>
T& Linklist<T>::GetData(int32_t index) const
{
	return GetUseNode(index)->mData;
}

template <typename T>
void Linklist<T>::Dilatation(int32_t dilatation_len)
{
	mCacheLen += dilatation_len;
	for (int16_t i = 0; i < dilatation_len; ++i)
	{
		Ln* cache = new Ln;
		cache->mPre = mCacheHead->mPre;
		cache->mNext = mCacheHead;
		mCacheHead->mPre->mNext = cache;
		mCacheHead->mPre = cache;
	}
}

template <typename T>
typename Linklist<T>::Ln* Linklist<T>::GetCacheNode(bool cut)
{
	if (mCacheLen <= 0)
	{
		Dilatation();
	}

	auto node = mCacheHead->mPre;
	if (cut)
	{
		mCacheHead->mPre = node->mPre;
		node->mPre->mNext = mCacheHead;
	}

	return node;
}

template <typename T>
typename Linklist<T>::Ln* Linklist<T>::GetUseNode(int32_t index) const
{
	Ln* node = nullptr;
	if (index >= 0 && index < mUseLen)
	{
		auto half = mUseLen / 2 - 1;
		node = mUseHead;
		// 正序
		if (index <= half)
		{
			for (int32_t i = 0; i <= index; i++)
			{
				node = node->mNext;
			}
		}
		// 反序
		else
		{
			index = mUseLen - index;
			for (int32_t i = 0; i < index; i++)
			{
				node = node->mPre;
			}
		}
	}
	return node;
}

#endif // !_LINK_LIST_H_
