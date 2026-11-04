# Query language

The search grammar shared by REST POST /query, the SDK Filter class and XIOS/3 searches.

2 topics from the published CloudBackend documentation, generated on 2026-10-15. Each ends with its public source link; prefer the link when a detail matters, this file is a snapshot.

## Contents

- [Searching the Database](#searching-the-database)
- [Query Language](#query-language)

## Searching the Database

This chapter is intended to explain how to perform searches and how to filter searches. The documentation will show that the CloudBackend database can be used as a replacement for an SQL based database.

It is possible to only retrieve the number of results found, without having the database send the information. This has advantages since it results in less bandwidth for the end-user.

#### Query Syntax

The query language that is used to communicate with the database is rather simple, yet if used correctly it can be very powerful. A search query is a list of search terms separated by whitespace and is presented in any of the following ways:

1. `[+/-][prefix:]term[*]`
2. `[+/-][prefix:]'term"term term'[*]`
3. `[+/-][prefix:]"term'term term"[*]`

The information contained in the brackets is optional. The plus and minus sign in front of the prefix is used to define if the term must or must not exist. This is similar to `AND` and `AND NOT` in SQL. Unprefixed terms are neither plus nor minus, they are instead used to increase the weight of a result and make it more relevant.

The prefix is also optional, but highly recommended to use. It consists of the local-name of an element, meaning that the namespace should not be used. As we mentioned in the meta data section of "Managing Objects" the local-name must be unique in the meta data field elsewise search will not be possible. If the prefix is omitted it will search all searchable meta data fields.

A term is often simply a word. If that is the case, then apostrophes and quotation marks should not be used. If a phrase is used and it contains whitespace, then these must be used to enclose the search phrase.

> **Note:** if the phrase contains quotation marks, then apostrophes should be used to enclose the term and vice versa.

To make the database return objects that contain words that start with the term supplied we must append an asterisk to our term.

1. `home://Documents/?+title:Acme*`
2. `home://Documents/?+summary:'Jenny"s Party'*`
3. `home://Documents/?+summary:"Jenny's Party"*`

> **Warning:** Note that we are using a slash at the end of the container path to indicate that we want to deal with XML data. If the slash is omitted, the search will fail.

### Filtering

Filtering search results is done by adding one or more search conditions. These are separated by whitespace. Only search results that match all conditions will be returned.

- `home://Documents/?+title:Acme -title:Sales -title:Jenny`

#### Special handling of @published, startdate and enddate key/values

These meta data fields are reserved and will be handled in a special way. The `@published`, which is set automatically by the database, is not indexed. Instead three separate values are indexed from the timestamp. The following date "2024-02-04" would index the following values:

- pubyear:2024
- pubmonth:02
- pubweek:06

A search query to fetch all objects created in February 2024 might look like this:

- `cat home://Documents/?pubyear:2024 pubmonth:02`

The `startdate` and `enddate` which might be used to create appointments which span over a time period and not just a moment in time might look like this when added as key/value meta data:

*(fragment)*

```xml
<startdate date="2023-12-10" time="01:54:00" zone="Z"/>
<enddate date="2024-01-09" time="00:00:00" zone="Z"/>
```

It would result in a special indexing that would save the following data

- year:2023
- year:2024
- month:12
- month:01
- week:50, week:51, week:52, week:01, week:02

#### No search results

When the database does not find any objects matching the search criteria it will only return the following XML. Note that this is the same as when there are no objects in a container.

**Empty container**

```xml
<?xml version="1.0"?>
<db:result xmlns:db="https://cloudbackend.com/db.xsd" xmlns:xlink="http://www.w3.org/1999/xlink">
  <db:paging start="0" size="100" total="0"/>
</db:result>
```

#### Next

- [Query Language](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/query-language)



*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/cloudbackend-database/searching-the-database>*

---

## Query Language

The supported query language is a powerful way to do queries in the [CloudBackend Singularity Database](https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/database/the-singularity). It allows querying across ranges, dates, key/value data, and object meta-data. It also makes it possible to include logical operations in queries and is the equivalent of SQL for CloudBackend.

The query language can be used through the CLI in the CloudBackend database together with XIOS/3, or with Filters in the CloudBackend SDK for Mobile & IoT.

### The query language

The query language works relative to the key/values and meta-data of objects in the database. Queries are performed against one or multiple containers, which provide a result set. The queries allow matching based on both boolean and probabilistic methods.

CloudBackend excels at finding object key/values that include a specific value of a key (called a term). Think of it as an index at the end of a book, where you can quickly locate all the pages that refer to a specific word or concept. Multiple result sets can then be merged based on common boolean operations like AND, OR, NOT etc. or simply weighted based on the relevance (which is more useful in an offline indexing scenario than key/value queries).

### The query syntax

The query language is very simple, yet rather powerful.

- (+/-)? (prefix)? (term with no blanks)
- (+/-)? (prefix)? (term with ' and blanks)
- (+/-)? (prefix)? (term with " and blanks)

A term is the word or phrase you wish to search for. Phrases are always enclosed by single or double quotes. The prefix, which is optional, is the key name. Finally, you may include a + or - sign in front of the prefix (or term, if there is no prefix) to indicate that the term must or must not exist.

Some key/values will also be stem-indexed (see next section). Searching for terms in these key/values will actually search for the stemmed term. By using the phrase syntax (single or double quotes) or by beginning the term with a capital letter will force the query parser to search for the word as-is instead.

#### Key/Value term syntax

[Key-word] [operator] [Value as string]

The key-word is case sensitive.

- : makes a string search ( * wildcard at the end makes a string search with a specific beginning followed by any characters)
- > gives a numerical greater than comparison.
- < gives a numerical less than comparison.

- Artist:ABBA
- Name:Pat*
- Id:010203
- Latitude:58.41*
- City:London
- Size:42
- Price<100
- Age>18

### Building the query tree

- All "plus" terms are combined with an AND relation, which simply means that all of them must exist.
- All "minus" terms are combined with an OR relation, and the group is added to the query with an AND_NOT relation, meaning that none of the terms must exist.
- All unprefixed terms with neither a plus or minus sign in front of them are combined with an OR relation, and then added to the query with an AND_MAYBE relation. This means that they do not have to be present, but objects that do include them will get higher ranking than those which don't.
- Prefixed terms with neither a plus or minus sign in front of them are grouped by their prefix. All terms with the same prefix are grouped with an OR relation, and all groups are then combined with an AND relation. The group of groups is then added to the query with a FILTER relation, which is equivalent with an AND relation, except that FILTER terms do not affect the ranking at all.

A term is the word or phrase you wish to search for. Phrases are always enclosed by single or double quotes. The prefix, which is optional, is the key name. Finally, you may include a + or - sign in front of the prefix (or term, if there is no prefix) to indicate that the term must or must not exist.

See below for example queries that might make it easier to understand how the query tree is created from a query string.

### System key/value terms and prefixes

There are a few pre-defined key/values in the meta-data that are bound to a so-called query prefix, and they are listed below. A query prefix is just a way of saying that the specific word has a special meaning and should be searchable as such. For example the title prefix, means that the words in the title for an object will not only be indexed as-is, but also with a prefix. title:spring finds objects that contain the word 'spring' in the title.. Note, title has nothing to do with the name of the author or creator of an object.

The list of pre-defined prefixes is shown below, as well at the objects' key/value they are bound to. Using the meta-data capabilities of the database, an arbitrary number of key/value pairs can be added to an objects meta-data. They can be in the form of non-indexed key/value pairs, or indexed key/value pairs that are searchable using the query language (but take up more space). Non-indexed key/value pairs are not possible to use as terms in the query language.

All defined prefixes are boolean prefixes, which means that if specified in a query, boolean semantics apply and not probabilistic.

Some of the key/values (currently author, content, rights, keyword, recipient, summary, tag and title) will also be indexed stemmed, that is, in addition to being indexed as-is (but with a prefix), the root of the word will also be indexed (with the prefix). A query with the term keyword:phones will also match an entry with the value of the key 'phone'.

The key/values; keyword, summary and title and content will additionally be indexed without the prefix, since they are assumed to include textual content.

Additionally, the key/values; published, updated, 'link rel="alternate" length="..."' and title are treated special to make it possible to sort the query result based on these key/values.

The inner workings of meta-data has been modelled after the W3C Atom standard with the ability for user custom extensions of key/value data and tags. This means that the objects stored in the database are extended with meta-data and key/values.

The following keys and prefixes are not available on all objects. Please check the available key/values of an object or its data type before including terms in queries.

| Query prefix | Key/Value | Description |
|---|---|---|
| title | @name | An objects title or rather simply the title of the object. |
| tag | tag | A user-specified tag (like "family", "London", "My wedding" etc). |
| type | @mime | The object's MIME type of its main stream (first stream). |
| namespace | namespace | The XML namespace if the object is an XML document. |
| schema | schema | The W3C schema of an object that is of type XML document, if it is defined in the XML. |
| author | author | The author's name, email or URI. |
| country | country | A two-letter ISO country code (same as used in domain names). |
| flag | flag | A general-purpose key/value flag that can be used by applications. |
| keyword | keyword | Keywords that describe the object. |
| lang | lang | The language of the object as a two-character ISO code. |
| recipient | recipient | The recipient's name, email or URI. |
| rights | rights | A copyright string. |
|  | content | Full-text free-text index of the main stream (first stream). |
| summary | summary | A summary of the object's content. |
|  | @published | This key is not indexed as-is (see pubweek, pubmonth, pubyear). |
| pubweek |  | This prefix is calculated from the published key. |
| pubmonth |  | This prefix is calculated from the published key. |
| pubyear |  | This prefix is calculated from the published key. |
|  | startdate | This key is not indexed as-is (see month, week, year). |
|  | enddate | This key is not indexed as-is (see month, week, year). |
| week |  | This prefix is calculated from the startdate and enddate keys. |
| month |  | This prefix is calculated from the startdate and enddate keys. |
| year |  | This prefix is calculated from the startdate and enddate keys. |
| object | @id | The object ID as a decimal number. |
| container | @pid | The ID of the container the object is located in (a decimal number). |
|  | @id | This key is not indexed. |

### Data types and automatic indexing

Data types may be defined to automatically index and extract meta-data from the main stream (first stream) of objects that matches the data type.

It is good practice to leverage the system key/value pairs and have the data type store its automated indexed data types as one of the above if there is a need to include the key/value pairs in the query language. Key/value pairs like flag, and more can be effectively used. Custom-defined automated meta-data extraction is currently supported for objects of MIME-type XML.

The CloudBackend database is shipped with templates for many known document and MIME-types, whereof the database knows how to automatically extract relevant key/value pairs, like for instance IDV3 tags from mp3 files or EXIF data from photos. In order to make use of this automated meta-data extraction, you need to enable the data type templates that you need meta-data extraction for. Each tenant account comes with no data types activated.

### Flag prefix values in use

Flags are application specific and defined by the developer. These flags are used for some of the built-in capabilities of the CloudBackend database when it comes to certain MIME-types of documents (if the corresponding data types are activated for the tenant).

- hidden
- avatar

- answered
- deleted
- flagged
- seen
- draft
- recent

### Special handling of published

The key/values published will not be indexed as-is. Instead, the dates specified will be recalculated as pubyear/year (the year with 4 digits), pubmonth/month (the month as two digits, 01 to 12) and pubweek/week (the ISO week number, 01 to 53).

We will use the following object meta-data as a simplified example:

```xml
<db:object name="t1.txt" published="2024-12-09T10:24:42Z" updated="2024-12-09T10:24:42Z" mime="text/plain" cid="62958581623899" id="560495422" xlink:actuate="onRequest" xlink:href="home://t1.txt"/> 
```

- pubyear:2024
- pubmonth:12
- pubweek:50

The idea is that any object, be it a text document, picture, calendar entry, email or to-do note, can be marked with a date or date range. Relevant objects can then be found quickly and presented in a calendar or reminder view in an application.

### Special handling of startdate and enddate

The key/values; startdate and enddate will not be indexed as-is. In case of startdate and enddate, the full range will be indexed.

We will use the following object meta-data as a simplified example:

```xml
<db:object name="t1.txt" published="2024-12-01T01:00:00Z" updated="2024-12-02T10:24:42Z" mime="text/plain" cid="62958581623899" id="560495422" xlink:actuate="onRequest" xlink:href="home://t2.xml">
  <startdate date="2024-12-29" time="06:01:00" zone="Z"/>
  <enddate date="2025-01-01" time="17:59:59" zone="Z"/>
</db:object> 
```

- year:2024, year:2025
- month:12, month:01
- week:52, week:01

The idea is that any object, be it a text document, picture, calendar entry, email or to-do note, can be marked with a date or date range. Relevant objects can then be found quickly and presented in a calendar or reminder view in an application.

(Note that since the year, month and week is indexed individually, the application will have to post-filter the search result, since the query "({year:2024 AND month:12})" will yield a false match.)

### Special handling of content

The content key/value will always be removed from the object when it is returned from the database. However, it is still indexed (as-is and stemmed), which means that this key/value is perfect for full-text indexing. The client can thus easily create a full-text index of any object simply by serializing the object to plain text string, then put the text inside the key 'content' value.

### Handling of non-system key/values

When an unknown prefix is found, it is simply indexed as-is, with prefix. It will not be added without prefix. Unknown keys are not stemmed. This applies to all user defined key/values and tags.

Please note that key/value pairs and tags that are defined as non-indexed cannot be queried. They are retrieved by querying the object on other parameters and then retrieving the meta-data to view them. It is recommended to use non-indexed key/value pairs as the default for all meta-data that is not required to be searchable as this is much more economical with less used storage space for the tenant. It will also increase the query performance for the keys that really should be searchable.

### Multiple search words

Normal, plus and minus terms:

```query
dogs cats +black -cool -"hot dogs" 
```

The query above searches for items that include the words "dog" or "cat" in one of several key/values (currently keyword, summary and title or content). Note the singular form! Unprefixed words are stemmed. Additionally, the word "black" must be present in the objects key/values for a match. The word "cool" and the phrase "hot dogs", on the other hand, must not be present at all.

The query above will be translated into the following query tree:

```query
(("black") AND_MAYBE ("dog" OR "cat")) AND_NOT ("cool" OR "hot dogs") 
```

If the query instead had been written using an initial capital letter on the words "dogs" or "cats", or had these words been quoted, like this:

```query
"dogs" cats +black -cool -"hot dogs" 
```

The resulting query tree would have been:

```query
(("black") AND_MAYBE ("dogs" OR "cats")) AND_NOT ("cool" OR "hot dogs") 
```

(Note the plural form on "dogs" and "cats".)

#### Prefixed terms

Consider the following query:

```query
title:money 
```

It will simply find all objects that include the word "money" in the title.

The next query will find all objects that describe JPEG or GIF images (based on the objects MIME-type, which requires that the object has a main stream 0 from where the MIME-type is deducted. Objects can not be queried on MIME-type for stream 1..n), and has the word "money" in the title key/value.

```query
title:money type:image/png type:image/gif 
```

Note that since the type key/value is searched for twice, the terms image/png and image/gif are combined with an OR relation, like this:

```query
"title:money" AND (type:image/png OR type:image/gif) 
```

This is probably the expected behavior for most key/values, but perhaps not all. Suppose one would like to find all objects that include the words "money" and "dollar" in the title key/value. The following query would not work:

```query
title:money title:dollar 
```

This is becuase it would return all objects with either the word "money" or the word "dollar" in it. Here the prefixed "plus" terms should be used:

```query
+title:money +title:dollar 
```

The query above will correctly translate into the correct query tree:

```query
title:money AND title:dollar 
```

#### Date queries

The following query example will return a set of candidate objects to be displayed in a calendar view of January 2025:

```query
year:2025 month:01 
```

### Additional query parameters

In addition to the query language, each query done using the query language may also include these parameters to further refine the query result.

These parameters are used to optimize, paginate, sort, or add special handling to executed queries. Please see the documentation for respective SDK on how to provide and use these parameters.

| Parameter | Description |
|---|---|
| query | The supplied query language string to search for |
| filter | A regular expression that is used to filter each result entry. See below for more information. |
| offset | The offset of the first object item to return, when paginating the query result list using count. The default, if unspecified, is 0. Please note that pagination is always turned on by default with count below. |
| count | The number of item objects to return. The default is 100. Use pagination to access objects beyond this specified count. |
| order | The sort order of the query result. The sort key can be any of these default meta-data key/values; title, published, updated and length. The default, if not present, is to sort by relevance according to the search criteria. |
| locale | A locale (like en_US or sv_SE) to be used when sorting. If unspecified or illegal, the C++ locale will be used. |
| numeric | Use numeric sorting, so for example Q9 comes before Q10. |
| ascending | The sort order for the query list, can be true or false. The default is true. |
| include_deleted | If selected, deleted revisions of objects will be included in the query result. This allows displaying a list of all previous revisions of an object. Can be set to true or false (default). If turned on, a key named 'dc:deleted' will appear on all previous revisions of the object with the value 'true'. |
| checksum | Can be true or false (default). Object items are returned with the key 'md5' if turned on. The value will be the MD5 checksum of the main stream of each object (first stream). Please note: If set to 'true', it will make most other parameters like query, filter and order ineffective and bypassed, as the datasrc parameter is set to 'db'. |
| datasrc | Can be 'default' (default) or 'db'. When running with the default data source, queries can be performed on the objects key/values. If set to 'db', it makes the query result sorted by title and includes all objects in the specified container(s), as the query runs in simple mode. The benefit of invoking the simple 'db' mode is that it yields much faster responses and allows for an optimization when more complex queries using the Query Language is not required. |

### Topics

*Source: <https://robinsbackend-robinsbackend-portalx.cloudbackend.cloud/cloudbackend/docs/guides/query-language>*

---
