using System.Runtime.Serialization;

namespace Solution.Models
{
	public class Total
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "totalSales")]
		public long TotalSales { get; set; }
	}
}