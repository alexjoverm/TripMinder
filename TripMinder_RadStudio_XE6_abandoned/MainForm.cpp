//---------------------------------------------------------------------------

#include <fmx.h>
#pragma hdrstop

//#include <android/log.h>
#include <string>
#include "MainForm.h"
#include "RESTMaker.h"


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
		//ShowMessage("Cambiado a 2");
	}
}

//---------------------------------------------------------------------------
//********************** DIALOG *****************************
//---------------------------------------------------------------------------

void __fastcall TMainForm::ButtonCancelClick(TObject *Sender)
{
	// Cancelar petición

	LayoutLoading->Visible = false;
   //	BlurScreen->Enabled = false;
}


void __fastcall TMainForm::ButtonSearchClick(TObject *Sender)
{

	TRESTMaker *aux = new TRESTMaker(); // De momento, al crearse se ejecuta
	ShowMessage(aux->RESTResponseDriving->Content);

	//LayoutLoading->Visible = true;

	// Activar efecto Blur, con su animación
	//BlurScreen->Enabled = true;

	//ShowMessage("Comprobando campos...");
	/*if(originData.second == ""){
		ShowMessage("Tiene que haber un origen");
		return;
	}


	if(originData.second == destinationData.second){
		ShowMessage("El origen y el destino deben ser diferentes");
		return;
	}              */

	//ShowMessage("Recogiendo detalles de origen y destino...");
	//TFormDialogModal *dlg = new TFormDialogModal(this);
	//dlg->ShowModal();


	/*if (dlg->ShowModal() == mrOk) {

		dlg->Free();
		// Cambiamos pestaña
		ChangeTabAction2->Tab = TabItem2;
		ChangeTabAction2->ExecuteTarget(this);
		ChangeTabAction2->Tab = TabItem1;
	}  */



	//ShowMessage("Haciendo petición a google...");


}





//---------------------------------------------------------------------------
//********************** ORIGIN Y DEST CONTROLS *****************************
//---------------------------------------------------------------------------

void __fastcall TMainForm::InputChange(TObject *Sender)
{
	if(!fromCode)  // solo cambios hechos desde la interfaz
	{
		TClearingEdit* aux = (TClearingEdit*)Sender;
		if(aux->Text != "")
		{
			AniIndicator1->Visible = true;
			// Binding no funcionaba bien, se hace asi
			RESTRequest1->Params->ParameterByName("input")->Value = aux->Text;

			// En cada Edit, ejecuta y crea su respectivo hilo
			if(aux == ClearingEdit1){
				originThread = RESTRequest1->ExecuteAsync();
				originThread->OnTerminate = OriginThreadTerminated;
			}
			else{
				destinationThread = RESTRequest1->ExecuteAsync();
				destinationThread->OnTerminate = DestinationThreadTerminated;
			}
		}
	}
	else
		fromCode = false; // Para que la próxima se active
}
//---------------------------------------------------------------------------



void __fastcall TMainForm::InputChangeTracking(TObject *Sender)
{
	ListBox1->Visible = false;
	ListBox2->Visible = false;
}



void __fastcall TMainForm::ListBoxItemClick(const TCustomListBox *Sender, const TListBoxItem *Item)
{
	 fromCode = true; // impedimos otra llamada al API de Google

	// Calculamos distancia a la que se encuentra el active record, y seleccionamos la row correspondiente
	 int i = ((TListBoxItem*)Item)->Index;
	 int moveby = i - (BindSourceDB1->DataSet->RecNo - 1);
	 BindSourceDB1->DataSet->MoveBy(moveby);
	 BindSourceDB1->DataSet->UpdateCursorPos();

	 // Guardamos par de id - description
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
}
//---------------------------------------------------------------------------



//** Se han separado los callbacks, ya que daban problemas

void __fastcall TMainForm::OriginThreadTerminated(TObject *Sender){

	ListBox1->Visible = true;
	if(ListBox1->Items->Count == 0)
		ListBox1->Items->Append("No hay resultados...");

	AniIndicator1->Visible = false;
}

void __fastcall TMainForm::DestinationThreadTerminated(TObject *Sender){

	ListBox2->Visible = true;
	if(ListBox2->Items->Count == 0)
		ListBox2->Items->Append("No hay resultados...");

	AniIndicator1->Visible = false;
}

