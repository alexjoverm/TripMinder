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

void __fastcall TMainForm::TabControl1Change(TObject *Sender)
{
	TTabControl *tabCtrl = (TTabControl*) Sender;
	if(tabCtrl->ActiveTab == TabItem2){
		ShowMessage("Cambiado a 2");
	}
}

void __fastcall TMainForm::ClearingEditParamsinputKeyUp(TObject *Sender, WORD &Key,
          System::WideChar &KeyChar, TShiftState Shift)
{
	 RESTRequest1->Execute();
}
//---------------------------------------------------------------------------

