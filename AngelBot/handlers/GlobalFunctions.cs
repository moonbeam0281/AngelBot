using System;
using System.Transactions;

namespace AngelBot.Handlers
{
    public static class GlobalFunctions
    {
        private static readonly Random GetRandom = new();

        public static int GetRandomNumber(int min, int max)
        {
            lock (GetRandom)
            {
                return GetRandom.Next(min, max);
            }
        }

        public static string[] Lex(string s)
        {
            bool insinuates = false;
            var tokens = new List<string> { "" };
            foreach (var c in s)
            {
                if (c == '"')
                {
                    insinuates = !insinuates;
                }
                else if (char.IsWhiteSpace(c) && insinuates == false)
                {
                    tokens.Add("");
                }
                else
                {
                    tokens[tokens.Count - 1] += c;
                }
            }

            return tokens.ToArray();
        }

        public static IEnumerable<T> ClearByCondition<T>(this IEnumerable<T> list, Func<T, T, bool> condition) where T : class
        {
            var ilist = new List<T>();

            list.ToList().ForEach(x =>
            {
                if (!ilist.Any(y => condition(x, y)))
                {
                    ilist.Add(x);
                }
            });
            return ilist;
        }

        public static IEnumerable<Type> GetAllTypes<T>()
        {
            var types = AppDomain.CurrentDomain.GetAssemblies().SelectMany(s => s.GetTypes())
                .Where(p => typeof(T).IsAssignableFrom(p) && p != typeof(T));
            return types;
        }
    }
}