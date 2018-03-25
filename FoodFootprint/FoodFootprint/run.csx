#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, IQueryable<Food> inputTable, TraceWriter log)
{
    // parse query parameter
    string name = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
        .Value;

    var foods = new List<Food>();
    foreach(var foodName in name.Split(','))
    {
        var searchCombinations = new List<string>{
            foodName,
            foodName + "S",
            foodName + "ES",
            foodName.TrimEnd('s','S').TrimEnd('e','E'),
            foodName.TrimEnd('s','S')
        };

        Food food = null;
        foreach(var searchTerm in searchCombinations)
        {
            food = inputTable.Where(f => f.PartitionKey == "FoodFootprint" && f.RowKey == searchTerm.ToUpper()).FirstOrDefault();
            if(food != null)
            {
                foods.Add(food);
                break;
            }
        }
    }

    return !foods.Any()
        ? req.CreateResponse(HttpStatusCode.NotFound, "Could not find food")
        : req.CreateResponse(HttpStatusCode.OK, foods);
}

public class Food : TableEntity
{
    public string Category	{get; set;}
    public double GramsCO2ePerServing {get; set;}
    public double GramsCO2ePerCal {get; set;}
}