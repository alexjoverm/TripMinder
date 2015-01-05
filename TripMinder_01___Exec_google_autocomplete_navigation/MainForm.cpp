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
	fromCode = false;
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
	if(!fromCode)
	{
		TClearingEdit* aux = (TClearingEdit*)Sender;
		if(aux->Text != "")
		{
			AniIndicator1->Visible = true;
			AniIndicator1->Visible = true;

			if(aux == ClearingEdit1){
				RESTRequest1->ClearBody();
				originThread = RESTRequest1->ExecuteAsync();
				originThread->OnTerminate = RestThreadTerminated;
			}
			else{
				RESTRequest2->ClearBody();
				destinationThread = RESTRequest2->ExecuteAsync();
				destinationThread->OnTerminate = RestThreadTerminated;
			}
		}
	}
	else
		fromCode = false;
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

void __fastcall TMainForm::ListBoxItemClick(const TCustomListBox *Sender, const TListBoxItem *Item)
{
	 fromCode = true; // impedimos otra llamada al API de Google

	// Calculamos distancia a la que se encuentra el active record, y seleccionamos la row correspondiente
	 int i = ((TListBoxItem*)Item)->Index;
	 int moveby = i - (BindSourceDB1->DataSet->RecNo - 1);
	 BindSourceDB1->DataSet->MoveBy(moveby);
	 BindSourceDB1->DataSet->UpdateCursorPos();

	 std::pair<String, String> id_desc;
	 id_desc.first = BindSourceDB1->DataSet->FieldByName("id")->AsString;
	 id_desc.second = BindSourceDB1->DataSet->FieldByName("description")->AsString;

	 if(Sender == ListBox1){
		 ClearingEdit1->Text = id_desc.second;
		 originData = id_desc;
		 ListBox1->Visible = false;
	 }
	 else{
		 ClearingEdit2->Text = id_desc.second;
		 destinationData = id_desc;
		 ListBox2->Visible = false;
	 }

	 ShowMessage(id_desc.first);
}
