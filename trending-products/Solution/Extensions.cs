using System;

namespace Solution
{
	public static class Extensions
	{
		public static T[] FastConcat<T>(this T[] x, T[] y)
		{
			if (x == null) throw new ArgumentNullException(nameof(x));
			if (y == null) throw new ArgumentNullException(nameof(y));
			var oldLen = x.Length;
			Array.Resize(ref x, x.Length + y.Length);
			Array.Copy(y, 0, x, oldLen, y.Length);
			return x;
		}
	}
}