//---------------------------------------------------------------------------

#pragma hdrstop

#include "RESTMaker.h"

//---------------------------------------------------------------------------
#pragma package(smart_init)


TRESTMaker::TRESTMaker(){

	RESTClientDriving = new TRESTClient("http://maps.googleapis.com/maps/api/directions/json");
	RESTRequestDriving = new TRESTRequest(NULL);
	RESTResponseDriving = new TRESTResponse(NULL);
	RESTResponseDataSetAdapterDriving = new TRESTResponseDataSetAdapter(NULL);
	ClientDataSetDriving = new TClientDataSet(NULL);

	// Set Request
	RESTRequestDriving->Client = RESTClientDriving;
	RESTRequestDriving->Response = RESTResponseDriving;

	RESTRequestDriving->AddParameter("origin", "Agost");
	RESTRequestDriving->AddParameter("origin", "Alicante");
	RESTRequestDriving->AddParameter("destination","Valencia");
	RESTRequestDriving->AddParameter("sensor", "false");


	RESTRequestDriving->Execute();


}

