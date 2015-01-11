// ---------------------------------------------------------------------------

#ifndef RESTMakerH
#define RESTMakerH

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
#include <Datasnap.DBClient.hpp>
#include <System.Actions.hpp>
#include <Data.Bind.Components.hpp>
#include <Data.Bind.EngExt.hpp>
#include <Data.Bind.ObjectScope.hpp>
#include <Fmx.Bind.DBEngExt.hpp>
#include <Fmx.Bind.Editors.hpp>

class TRESTMaker : public TObject {
public:
	TRESTClient *RESTClientDriving;
	TRESTRequest *RESTRequestDriving;
	TRESTResponse *RESTResponseDriving;
	TRESTResponseDataSetAdapter *RESTResponseDataSetAdapterDriving;
	TClientDataSet *ClientDataSetDriving;

	/* TBindingsList *BindingsList1;

	 TStringField *FDMemTable1description;
	 TStringField *FDMemTable1id;
	 TStringField *FDMemTable1matched_substrings;
	 TStringField *FDMemTable1place_id;
	 TStringField *FDMemTable1reference;
	 TStringField *FDMemTable1terms;
	 TStringField *FDMemTable1types;
	 TBindSourceDB *BindSourceDB1; */

     TRESTMaker();

};

// ---------------------------------------------------------------------------
#endif
