using System;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
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
            if (string.IsNullOrWhiteSpace(s)) return Array.Empty<string>();

            bool inQuotes = false;
            var current = new List<char>();
            var tokens = new List<string>();

            foreach (var ch in s)
            {
                if (ch == '"')
                {
                    inQuotes = !inQuotes;
                    continue;
                }

                if (char.IsWhiteSpace(ch) && !inQuotes)
                {
                    if (current.Count > 0)
                    {
                        tokens.Add(new string(current.ToArray()));
                        current.Clear();
                    }
                }
                else
                {
                    current.Add(ch);
                }
            }

            if (current.Count > 0)
                tokens.Add(new string(current.ToArray()));

            return tokens.Where(t => !string.IsNullOrWhiteSpace(t)).ToArray();
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
            var target = typeof(T);
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(
                a =>
                {
                    try
                    {
                        return a.GetTypes();
                    }
                    catch (ReflectionTypeLoadException ex)
                    {
                        return ex.Types.OfType<Type>();
                    }
                }
            ).Where(t =>
            t is not null &&
            target.IsAssignableFrom(t) &&
            t != target &&
            !t.IsAbstract &&
            !t.IsInterface &&
            t.GetConstructor(Type.EmptyTypes) != null);
        }

        /*
        public static IEnumerable<Type> GetAllTypes<T>()
        {
            var types = AppDomain.CurrentDomain.GetAssemblies().SelectMany(s => s.GetTypes())
                .Where(p => typeof(T).IsAssignableFrom(p) && p != typeof(T));
            return types;
        }*/
    }
}