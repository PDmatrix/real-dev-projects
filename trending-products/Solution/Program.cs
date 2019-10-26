using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Solution.Models;
using Utf8Json;

namespace Solution
{
	internal static class Program
	{
		public static void Main(string[] args)
		{
			var arguments = ParseArgs(args);
			var statistics = GetStatistics(arguments.Paths);

			var totalMap = new Dictionary<string, long>();
			var averageMap = new Dictionary<string, Average>();
			FillTotalAndAverageMap(statistics, totalMap, averageMap);

			var bestSellers = GetBestSellers(totalMap, arguments.Num);
			var trending = GetTrending(averageMap, arguments.Num);

			Console.WriteLine(JsonSerializer.ToJsonString(new {bestSellers, trending}));
		}

		private static IEnumerable<Trending> GetTrending(
			IDictionary<string, Average> averageMap, int count)
		{
			return averageMap
				.Select(x => new Trending
				{
					Id = x.Key,
					AverageIncrease = x.Value.Increase / x.Value.Count
				})
				.Where(x => x.AverageIncrease > 0)
				.OrderByDescending(x => x.AverageIncrease)
				.Take(count);
		}

		private static IEnumerable<Total> GetBestSellers(
			IDictionary<string, long> totalMap, int count)
		{
			return totalMap
				.Select(x => new Total
				{
					Id = x.Key,
					TotalSales = x.Value
				})
				.Where(x => x.TotalSales > 0)
				.OrderByDescending(x => x.TotalSales)
				.Take(count);
		}

		private static void FillTotalAndAverageMap(
			IEnumerable<Statistic> statistics,
			IDictionary<string, long> totalMap,
			IDictionary<string, Average> averageMap)
		{
			foreach (var item in statistics)
			{
				totalMap[item.Id] = (totalMap.ContainsKey(item.Id) ? totalMap[item.Id] : 0)
				                    + item.Sales;

				if (!averageMap.TryGetValue(item.Id, out var average))
				{
					averageMap[item.Id] = new Average
					{
						Current = item
					};
					continue;
				}

				var avItem = averageMap[item.Id];
				if (avItem.Current == null)
					continue;

				avItem.Increase = average.Increase + item.Sales - average.Current.Sales;
				avItem.Current = item;
				avItem.Count += 1;
			}
		}

		private static IEnumerable<Statistic> GetStatistics(IEnumerable<string> paths)
		{
			var statistics = GetStatisticsFromFiles(paths);
			
			var list = statistics.ToList(); 
			list.Sort((a, b) => string.CompareOrdinal(a.Date, b.Date));
			
			return list;
		}

		private static IEnumerable<Statistic> GetStatisticsFromFiles(IEnumerable<string> paths)
		{
			Statistic[] statistics = { };
			statistics = paths.Aggregate(statistics,
				(current, path) => current.FastConcat(ReadFile(path).ToArray()));

			return statistics;
		}

		private static IEnumerable<Statistic> ReadFile(string path)
		{
			using var fs = File.Open(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
			using var bs = new BufferedStream(fs);
			using var sr = new StreamReader(bs);

			string statistic;
			while ((statistic = sr.ReadLine()) != null)
			{
				if (string.IsNullOrWhiteSpace(statistic))
					continue;

				var res = JsonSerializer.Deserialize<Statistic>(statistic);
				yield return res;
			}
		}

		private static ArgOption ParseArgs(string[] args)
		{
			return new ArgOption
			{
				Num = int.Parse(args[1]),
				Paths = args[2..]
			};
		}
	}
}