#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, IQueryable<Food> inputTable, TraceWriter log)
{
    var foodNames = inputTable.Where(f => f.PartitionKey == "FoodFootprint").Select(f => f.RowKey).ToList();
    return req.CreateResponse(HttpStatusCode.OK, foodNames);
}

public class Food : TableEntity
{
    public string Category	{get; set;}
    public double GramsCO2ePerServing {get; set;}
    public double GramsCO2ePerCal {get; set;}
}