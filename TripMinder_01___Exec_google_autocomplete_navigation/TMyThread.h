//---------------------------------------------------------------------------

#ifndef TMyThreadH
#define TMyThreadH
//---------------------------------------------------------------------------
#include <System.Classes.hpp>
//---------------------------------------------------------------------------
class MyThread : public TThread
{
private:
protected:
	void __fastcall Execute();
public:
	__fastcall MyThread(bool CreateSuspended);
};
//---------------------------------------------------------------------------
#endif
