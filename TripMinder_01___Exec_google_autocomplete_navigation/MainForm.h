//---------------------------------------------------------------------------

#ifndef MainFormH
#define MainFormH
//---------------------------------------------------------------------------
#include <System.Classes.hpp>
#include <FMX.Controls.hpp>
#include <FMX.Forms.hpp>
#include <FMX.TabControl.hpp>
#include <FMX.Types.hpp>
#include <FMX.StdCtrls.hpp>
#include <FMX.ActnList.hpp>
#include <System.Actions.hpp>
#include <Data.Bind.Components.hpp>
#include <Data.Bind.EngExt.hpp>
#include <Data.Bind.ObjectScope.hpp>
#include <Fmx.Bind.DBEngExt.hpp>
#include <Fmx.Bind.Editors.hpp>
#include <FMX.Edit.hpp>
#include <IPPeerClient.hpp>
#include <REST.Client.hpp>
#include <System.Bindings.Outputs.hpp>
#include <System.Rtti.hpp>
#include <FMX.Layouts.hpp>
#include <FMX.Memo.hpp>
//---------------------------------------------------------------------------
class TMainForm : public TForm
{
__published:	// IDE-managed Components
	TTabControl *TabControl1;
	TToolBar *BottomToolBar;
	TActionList *ActionList1;
	TTabItem *TabItem1;
	TTabItem *TabItem2;
	TToolBar *TopToolBar;
	TLabel *ToolBarLabel;
	TToolBar *TopToolBar1;
	TSpeedButton *btnBack;
	TLabel *ToolBarLabel1;
	TChangeTabAction *ChangeTabAction1;
	TChangeTabAction *ChangeTabAction2;
	TSpeedButton *SpeedButton1;
	TRESTClient *RESTClient1;
	TRESTRequest *RESTRequest1;
	TRESTResponse *RESTResponse1;
	TBindingsList *BindingsList1;
	TClearingEdit *ClearingEditParamsinput;
	TLabel *LabelParamsinput;
	TLinkControlToField *LinkControlToFieldParamsinput;
	TMemo *MemoContent;
	TLinkControlToField *LinkControlToFieldContent;
	void __fastcall FormCreate(TObject *Sender);
	void __fastcall FormKeyUp(TObject *Sender, WORD &Key, System::WideChar &KeyChar,
		  TShiftState Shift);
	void __fastcall TabControl1Change(TObject *Sender);
	void __fastcall ClearingEditParamsinputKeyUp(TObject *Sender, WORD &Key, System::WideChar &KeyChar,
		  TShiftState Shift);

private:	// User declarations
public:		// User declarations
	__fastcall TMainForm(TComponent* Owner);
};
//---------------------------------------------------------------------------
extern PACKAGE TMainForm *MainForm;
//---------------------------------------------------------------------------
#endif
