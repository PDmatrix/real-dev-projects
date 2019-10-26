using System.Runtime.Serialization;

namespace Solution.Models
{
	public class Statistic
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }
		[DataMember(Name = "date")]
		public string Date { get; set; }
		[DataMember(Name = "sales")]
		public long Sales { get; set; }
	}
}