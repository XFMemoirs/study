#ifndef _SINGLETON_BASE_H_
#define _SINGLETON_BASE_H_

// 单例基类
// 继承此类即成为单例
template <typename sgt_class>
class SingletonBase
{
public:
	inline static sgt_class* GetInstance(void)
	{
		static sgt_class ins;
		return &ins;
	}

protected:
	SingletonBase(void) {}

	virtual ~SingletonBase(void) {}

	SingletonBase(const SingletonBase& that) = delete;

	SingletonBase(SingletonBase&& that) = delete;

	SingletonBase& operator = (const SingletonBase& that) = delete;

	SingletonBase& operator = (SingletonBase&& that) = delete;
};

#endif // !_SINGLETON_BASE_H_
