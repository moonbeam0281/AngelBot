using System;
using Npgsql;

namespace AngelBot.Database
{
    public static class QueryHelper
    {
        public static T? GetNullable<T>(this NpgsqlDataReader reader, int ordinal) where T : struct
            => reader.IsDBNull(ordinal) ? null : reader.GetFieldValue<T>(ordinal);


        public static string? GetNullableString(this NpgsqlDataReader reader, int ordinal)
            => reader.IsDBNull(ordinal) ? null : reader.GetString(ordinal);
    }
}
