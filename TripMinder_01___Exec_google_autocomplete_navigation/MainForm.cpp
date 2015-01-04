//---------------------------------------------------------------------------

#include <fmx.h>
#pragma hdrstop

//#include <android/log.h>
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
	//thread = new MyThread(True);
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

//---------------------------------------------------------------------------

void __fastcall TMainForm::InputChange(TObject *Sender)
{
	TClearingEdit* aux = (TClearingEdit*)Sender;
	if(aux->Text != "")
	{
		AniIndicator1->Visible = true;
		AniIndicator1->Visible = true;

		RESTRequest1->ClearBody();

		if(aux == ClearingEdit1){
			originThread = RESTRequest1->ExecuteAsync();
			originThread->OnTerminate = RestThreadTerminated;
		}
		else{
			destinationThread = RESTRequest1->ExecuteAsync();
			destinationThread->OnTerminate = RestThreadTerminated;
        }
	}
}
//---------------------------------------------------------------------------


void __fastcall TMainForm::InputChangeTracking(TObject *Sender)
{
	ListBox1->Visible = false;
	ListBox2->Visible = false;
}
//---------------------------------------------------------------------------


void __fastcall TMainForm::RestThreadTerminated(TObject *Sender){

	if((TRESTExecutionThread*)Sender == originThread){
		ListBox1->Visible = true;
		if(ListBox1->Items->Count == 0)
			ListBox1->Items->Append("No hay resultados...");
	}
	else{
		ListBox2->Visible = true;
		if(ListBox2->Items->Count == 0)
			ListBox2->Items->Append("No hay resultados...");
    }

	AniIndicator1->Visible = false;
	AniIndicator1->Visible = false;

}
//---------------------------------------------------------------------------

