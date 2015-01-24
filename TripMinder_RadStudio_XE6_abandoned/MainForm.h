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
#include <FMX.Objects.hpp>
#include <FMX.ListView.hpp>
#include <FMX.ListView.Types.hpp>
#include <FMX.ListBox.hpp>
#include <Data.DB.hpp>
#include <FireDAC.Comp.Client.hpp>
#include <FireDAC.Comp.DataSet.hpp>
#include <FireDAC.DApt.Intf.hpp>
#include <FireDAC.DatS.hpp>
#include <FireDAC.Phys.Intf.hpp>
#include <FireDAC.Stan.Error.hpp>
#include <FireDAC.Stan.Intf.hpp>
#include <FireDAC.Stan.Option.hpp>
#include <FireDAC.Stan.Param.hpp>
#include <REST.Response.Adapter.hpp>
#include <Data.Bind.DBScope.hpp>
#include <FMX.Ani.hpp>
#include <FMX.ExtCtrls.hpp>
#include <FMX.Effects.hpp>
#include <Datasnap.DBClient.hpp>

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
	TSpeedButton *ButtonSearch;
	TRESTClient *RESTClient1;
	TRESTRequest *RESTRequest1;
	TRESTResponse *RESTResponse1;
	TBindingsList *BindingsList1;
	TListBox *ListBox1;
	TRESTResponseDataSetAdapter *RESTResponseDataSetAdapter1;
	TFDMemTable *FDMemTable1;
	TStringField *FDMemTable1description;
	TStringField *FDMemTable1id;
	TStringField *FDMemTable1matched_substrings;
	TStringField *FDMemTable1place_id;
	TStringField *FDMemTable1reference;
	TStringField *FDMemTable1terms;
	TStringField *FDMemTable1types;
	TBindSourceDB *BindSourceDB1;
	TLinkFillControlToField *LinkFillControlToField1;
	TAniIndicator *AniIndicator1;
	TFloatAnimation *AnimHeight;
	TClearingEdit *ClearingEdit1;
	TClearingEdit *ClearingEdit2;
	TListBox *ListBox2;
	TLinkFillControlToField *LinkFillControlToField2;
	TLabel *Label1;
	TLayout *LayOrig;
	TLayout *LayDest;
	TFloatAnimation *AnimHeight2;
	TLayout *LayoutLoading;
	TAniIndicator *AniIndicator2;
	TLabel *LabelLoading;
	TShadowEffect *ShadowEffect1;
	TRectangle *RectContainer;
	TButton *Button1;
	TRectangle *RectBackground;
	void __fastcall FormCreate(TObject *Sender);
	void __fastcall FormKeyUp(TObject *Sender, WORD &Key, System::WideChar &KeyChar,
		  TShiftState Shift);
	void __fastcall TabControl1Change(TObject *Sender);
	void __fastcall InputChange(TObject *Sender);
	void __fastcall InputChangeTracking(TObject *Sender);
	void __fastcall ListBoxItemClick(const TCustomListBox *Sender, const TListBoxItem *Item);
	void __fastcall ButtonSearchClick(TObject *Sender);
	void __fastcall ButtonCancelClick(TObject *Sender);

private:	// User declarations
	TRESTExecutionThread *originThread, *destinationThread;
	std::pair<String, String> originData, destinationData;
	bool fromCode;

	void __fastcall OriginThreadTerminated(TObject *Sender);
	void __fastcall DestinationThreadTerminated(TObject *Sender);

public:		// User declarations
	__fastcall TMainForm(TComponent* Owner);
};
//---------------------------------------------------------------------------
extern PACKAGE TMainForm *MainForm;
//---------------------------------------------------------------------------
#endif
