//---------------------------------------------------------------------------

#include <fmx.h>
#pragma hdrstop

#include <android/log.h>
#include <string>
#include "MainForm.h"


//---------------------------------------------------------------------------
#pragma package(smart_init)
#pragma resource "*.fmx"

TMainForm *MainForm;
//---------------------------------------------------------------------------
__fastcall TMainForm::TMainForm(TComponent* Owner)
	: TForm(Owner)
{
}
//---------------------------------------------------------------------------
void __fastcall TMainForm::FormCreate(TObject *Sender)
{
	// This define the default active tab at runtime
	TabControl1->ActiveTab = TabItem1;
}
//---------------------------------------------------------------------------

void __fastcall TMainForm::FormKeyUp(TObject *Sender, WORD &Key,
          System::WideChar &KeyChar, TShiftState Shift)
{
  if (Key == vkHardwareBack) {
	if (TabControl1->ActiveTab == TabItem2) {
		ChangeTabAction1->Tab = TabItem1;
		ChangeTabAction1->ExecuteTarget(this);
		ChangeTabAction1->Tab = TabItem2;
		Key = 0;
	}
  }
}
//---------------------------------------------------------------------------

