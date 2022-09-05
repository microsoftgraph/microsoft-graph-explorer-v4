/* eslint-disable */
export const rules =
  `
odataUri = serviceRoot [ odataRelativeUri ]

serviceRoot = ( "https" / "http" )                    ; Note: case-insensitive
              "://" host [ ":" port ]
              "/" *( segment-nz "/")

; Note: dollar-prefixed path segments are case-sensitive!
odataRelativeUri = '$batch'  [ "?" batchOptions ]
                 / '$entity' "?" entityOptions
                 / '$entity' "/" optionallyQualifiedEntityTypeName "?" entityCastOptions
                 / '$metadata' [ "?" metadataOptions ]
                 / resourcePath [ "?" queryOptions ]


;------------------------------------------------------------------------------
; 1. Resource Path
;------------------------------------------------------------------------------

resourcePath = entitySetName                  [ collectionNavigation ]
             / singletonEntity                [ singleNavigation ]
             / actionImportCall
             / entityColFunctionImportCall    [ collectionNavigation ]
             / entityFunctionImportCall       [ singleNavigation ]
             / complexColFunctionImportCall   [ complexColPath ]
             / complexFunctionImportCall      [ complexPath ]
             / primitiveColFunctionImportCall [ primitiveColPath ]
             / primitiveFunctionImportCall    [ primitivePath ]
             / functionImportCallNoParens     [ querySegment ]
             / crossjoin                      [ querySegment ]
             / '$all'                         [ "/" optionallyQualifiedEntityTypeName ]

collectionNavigation = [ "/" optionallyQualifiedEntityTypeName ] [ collectionNavPath ]
collectionNavPath    = keyPredicate [ singleNavigation ]
                     / filterInPath [ collectionNavigation ]
                     / each [ boundOperation ]
                     / boundOperation
                     / count
                     / ref
                     / querySegment

keyPredicate     = simpleKey / compoundKey / keyPathSegments
simpleKey        = OPEN ( parameterAlias / keyPropertyValue ) CLOSE
compoundKey      = OPEN keyValuePair *( COMMA keyValuePair ) CLOSE
keyValuePair     = ( primitiveKeyProperty / keyPropertyAlias  ) EQ ( parameterAlias / keyPropertyValue )
keyPropertyValue = primitiveLiteral
keyPropertyAlias = odataIdentifier
keyPathSegments  = 1*( "/" keyPathLiteral )
keyPathLiteral   = *pchar

singleNavigation = [ "/" optionallyQualifiedEntityTypeName ]
                   [ "/" propertyPath
                   / boundOperation
                   / ref
                   / value  ; request the media resource of a media entity
                   / querySegment
                   ]

propertyPath = entityColNavigationProperty [ collectionNavigation ]
             / entityNavigationProperty    [ singleNavigation ]
             / complexColProperty          [ complexColPath ]
             / complexProperty             [ complexPath ]
             / primitiveColProperty        [ primitiveColPath ]
             / primitiveProperty           [ primitivePath ]
             / streamProperty              [ boundOperation ]

primitiveColPath = count / boundOperation / ordinalIndex / querySegment

primitivePath  = value / boundOperation / querySegment

complexColPath = ordinalIndex
               / [ "/" optionallyQualifiedComplexTypeName ] [ count / boundOperation / querySegment ]

complexPath    = [ "/" optionallyQualifiedComplexTypeName ]
                 [ "/" propertyPath
                 / boundOperation
                 / querySegment
                 ]

filterInPath = '/$filter' OPEN boolCommonExpr CLOSE

each  = '/$each'
count = '/$count'
ref   = '/$ref'
value = '/$value'

querySegment = '/$query'

ordinalIndex = "/" 1*DIGIT

; boundOperation segments can only be composed if the type of the previous segment
; matches the type of the first parameter of the action or function being called.
; Note that the rule name reflects the return type of the function.
boundOperation = "/" ( boundActionCall
                     / boundEntityColFunctionCall    [ collectionNavigation ]
                     / boundEntityFunctionCall       [ singleNavigation ]
                     / boundComplexColFunctionCall   [ complexColPath ]
                     / boundComplexFunctionCall      [ complexPath ]
                     / boundPrimitiveColFunctionCall [ primitiveColPath ]
                     / boundPrimitiveFunctionCall    [ primitivePath ]
                     / boundFunctionCallNoParens     [ querySegment ]
                     )

actionImportCall = actionImport
boundActionCall  = [ namespace "." ] action
                   ; with the added restriction that the binding parameter MUST be either an entity or collection of entities
                   ; and is specified by reference using the URI immediately preceding (to the left) of the boundActionCall

; The following boundXxxFunctionCall rules have the added restrictions that
;  - the function MUST support binding, and
;  - the binding parameter type MUST match the type of resource identified by the
;    URI immediately preceding (to the left) of the boundXxxFunctionCall, and
;  - the functionParameters MUST NOT include the bindingParameter.
boundEntityFunctionCall       = [ namespace "." ] entityFunction       functionParameters
boundEntityColFunctionCall    = [ namespace "." ] entityColFunction    functionParameters
boundComplexFunctionCall      = [ namespace "." ] complexFunction      functionParameters
boundComplexColFunctionCall   = [ namespace "." ] complexColFunction   functionParameters
boundPrimitiveFunctionCall    = [ namespace "." ] primitiveFunction    functionParameters
boundPrimitiveColFunctionCall = [ namespace "." ] primitiveColFunction functionParameters

boundFunctionCallNoParens     = [ namespace "." ] entityFunction
                              / [ namespace "." ] entityColFunction
                              / [ namespace "." ] complexFunction
                              / [ namespace "." ] complexColFunction
                              / [ namespace "." ] primitiveFunction
                              / [ namespace "." ] primitiveColFunction

entityFunctionImportCall       = entityFunctionImport       functionParameters
entityColFunctionImportCall    = entityColFunctionImport    functionParameters
complexFunctionImportCall      = complexFunctionImport      functionParameters
complexColFunctionImportCall   = complexColFunctionImport   functionParameters
primitiveFunctionImportCall    = primitiveFunctionImport    functionParameters
primitiveColFunctionImportCall = primitiveColFunctionImport functionParameters

functionImportCallNoParens     = entityFunctionImport
                               / entityColFunctionImport
                               / complexFunctionImport
                               / complexColFunctionImport
                               / primitiveFunctionImport
                               / primitiveColFunctionImport

functionParameters = OPEN [ functionParameter *( COMMA functionParameter ) ] CLOSE
functionParameter  = parameterName EQ ( parameterAlias / primitiveLiteral )
parameterName      = odataIdentifier
parameterAlias     = AT odataIdentifier

crossjoin = '$crossjoin' OPEN
            entitySetName *( COMMA entitySetName )
            CLOSE


;------------------------------------------------------------------------------
; 2. Query Options
;------------------------------------------------------------------------------

queryOptions = queryOption *( "&" queryOption )
queryOption  = systemQueryOption
             / aliasAndValue
             / nameAndValue
             / customQueryOption

batchOptions = batchOption *( "&" batchOption )
batchOption  = format
             /customQueryOption

metadataOptions = metadataOption *( "&" metadataOption )
metadataOption  = format
                /customQueryOption

entityOptions  = *( entityIdOption "&" ) id *( "&" entityIdOption )
entityIdOption = format
               / customQueryOption
entityCastOptions = *( entityCastOption "&" ) id *( "&" entityCastOption )
entityCastOption  = entityIdOption
                  / expand
                  / select

id = ( "$id" / "id" ) EQ IRI-in-query

systemQueryOption = compute
                  / deltatoken
                  / expand
                  / filter
                  / format
                  / id
                  / inlinecount
                  / orderby
                  / schemaversion
                  / search
                  / select
                  / skip
                  / skiptoken
                  / top
                  / index

compute          = ( "$compute" / "compute" ) EQ computeItem *( COMMA computeItem )
computeItem      = commonExpr RWS "as" RWS computedProperty
computedProperty = odataIdentifier

expand            = ( "$expand" / "expand" ) EQ expandItem *( COMMA expandItem )
expandItem        = "$value"
                  / expandPath
                  / optionallyQualifiedEntityTypeName "/" expandPath
expandPath        = *( ( complexProperty / complexColProperty / optionallyQualifiedComplexTypeName / complexAnnotationInQuery ) "/" )
                    ( STAR [ ref / OPEN levels CLOSE ]
                    / streamProperty
                    / ( navigationProperty / entityAnnotationInQuery ) [ "/" optionallyQualifiedEntityTypeName ]
                      [ ref   [ OPEN expandRefOption   *( SEMI expandRefOption   ) CLOSE ]
                      / count [ OPEN expandCountOption *( SEMI expandCountOption ) CLOSE ]
                      /         OPEN expandOption      *( SEMI expandOption      ) CLOSE
                      ]
                    )
expandCountOption = filter
                  / search
expandRefOption   = expandCountOption
                  / orderby
                  / skip
                  / top
                  / inlinecount
expandOption      = expandRefOption
                  / select
                  / expand
                  / compute
                  / levels
                  / aliasAndValue

levels = ( "$levels" / "levels" ) EQ ( oneToNine *DIGIT / "max" )

filter = ( "$filter" / "filter" ) EQ boolCommonExpr

orderby     = ( "$orderby" / "orderby" ) EQ orderbyItem *( COMMA orderbyItem )
orderbyItem = commonExpr [ RWS ( "asc" / "desc" ) ]

skip = ( "$skip" / "skip" ) EQ 1*DIGIT
top  = ( "$top"  / "top"  ) EQ 1*DIGIT

index  = ( "$index" / "index" ) EQ 1*DIGIT

format = ( "$format" / "format" ) EQ
         ( "atom"
         / "json"
         / "xml"
         / 1*pchar "/" 1*pchar ; <a data service specific value indicating a
         )                     ; format specific to the specific data service> or
                               ; <An IANA-defined [IANA-MMT] content type>

inlinecount = ( "$count" / "count" ) EQ booleanValue

schemaversion   = ( "$schemaversion" / "schemaversion" ) EQ ( STAR / 1*unreserved )

search     = ( "$search" / "search" ) EQ BWS ( searchExpr / searchExpr-incomplete )

searchExpr = ( searchParenExpr
             / searchNegateExpr
             / searchPhrase
             / searchWord
             ) [ searchOrExpr
               / searchAndExpr
               ]
searchParenExpr = OPEN BWS searchExpr BWS CLOSE

; NOT is a unary operator if followed by a search expression
searchNegateExpr = 'NOT' RWS searchExpr

; AND and OR are binary operators if they appear between search expressions
searchOrExpr  = RWS 'OR'  RWS searchExpr
searchAndExpr = RWS [ 'AND' RWS ] searchExpr

searchPhrase = quotation-mark 1*( qchar-no-AMP-DQUOTE / SP ) quotation-mark

; A searchWord is a sequence of one or more non-whitespace characters, excluding
; - literal or percent-encoded parentheses "(", "%28", "%29", ")"
; - literal or percent-encoded double-quotes '"' and "%22"
; - the semicolon ";"
; Percent-encoding is allowed, and required for characters with special meaning in the query part of a URL, especially "&" and "#".
; Expressing this in ABNF is somewhat clumsy, so the following rule is overly generous.
; Note: the words AND, OR, and NOT are sometimes operators, depending on their position within a search expression.
searchWord = searchChar *( searchChar / SQUOTE )
searchChar = unreserved / pct-encoded-no-DQUOTE / "!" / "*" / "+" / "," / ":" / "@" / "/" / "?" / "$" / "="

searchExpr-incomplete = SQUOTE *( SQUOTE-in-string / qchar-no-AMP-SQUOTE / quotation-mark / SP ) SQUOTE


select         = ( "$select" / "select" ) EQ selectItem *( COMMA selectItem )
selectItem     = STAR
               / allOperationsInSchema
               / selectProperty
               / optionallyQualifiedActionName
               / optionallyQualifiedFunctionName
               / ( optionallyQualifiedEntityTypeName / optionallyQualifiedComplexTypeName )
                 "/" ( selectProperty
                     / optionallyQualifiedActionName
                     / optionallyQualifiedFunctionName
                     )
selectProperty = primitiveProperty / primitiveAnnotationInQuery
               / ( primitiveColProperty / primitiveColAnnotationInQuery ) [ OPEN selectOptionPC *( SEMI selectOptionPC ) CLOSE ]
               / navigationProperty
               / selectPath [ OPEN selectOption *( SEMI selectOption ) CLOSE
                            / "/" selectProperty
                            ]
selectPath     = ( complexProperty / complexColProperty / complexAnnotationInQuery ) [ "/" optionallyQualifiedComplexTypeName ]
selectOptionPC = filter / search / inlinecount / orderby / skip / top
selectOption   = selectOptionPC
               / compute / select / aliasAndValue

allOperationsInSchema = namespace "." STAR

; The parameterNames uniquely identify the bound function overload
; Necessary only if it has overloads
optionallyQualifiedActionName   = [ namespace "." ] action
optionallyQualifiedFunctionName = [ namespace "." ] function [ OPEN parameterNames CLOSE ]

; The names of all non-binding parameters, separated by commas
parameterNames = parameterName *( COMMA parameterName )

deltatoken = "$deltatoken" EQ 1*( qchar-no-AMP )

skiptoken = "$skiptoken" EQ 1*( qchar-no-AMP )

aliasAndValue = parameterAlias EQ parameterValue

nameAndValue = parameterName EQ parameterValue

parameterValue = arrayOrObject
               / commonExpr

customQueryOption = customName [ EQ customValue ]
customName        = qchar-no-AMP-EQ-AT-DOLLAR *( qchar-no-AMP-EQ )
customValue       = *( qchar-no-AMP )

complexAnnotationInQuery = annotationInQuery ; complex-valued annotation
entityAnnotationInQuery  = annotationInQuery ; entity-valued annotation

primitiveAnnotationInQuery    = annotationInQuery ; primitive-valued annotation
primitiveColAnnotationInQuery = annotationInQuery ; primitive collection-valued annotation

;------------------------------------------------------------------------------
; 3. Context URL Fragments
;------------------------------------------------------------------------------

context         = "#" contextFragment
contextFragment = %s"Collection($ref)"
                / %s"$ref"
                / %s"Collection(Edm.EntityType)"
                / %s"Collection(Edm.ComplexType)"
                / singletonEntity [ navigation *( containmentNavigation ) [ "/" qualifiedEntityTypeName ] ] [ selectList ]
                / qualifiedTypeName [ selectList ]
                / entitySet ( %s"/$deletedEntity" / %s"/$link" / %s"/$deletedLink" )
                / entitySet keyPredicate "/" contextPropertyPath [ selectList ]
                / entitySet [ selectList ] [ %s"/$entity" / %s"/$delta" ]

entitySet = entitySetName *( containmentNavigation ) [ "/" qualifiedEntityTypeName ]

containmentNavigation = keyPredicate [ "/" qualifiedEntityTypeName ] navigation
navigation            = *( "/" complexProperty [ "/" qualifiedComplexTypeName ] ) "/" navigationProperty

selectList         = OPEN [ selectListItem *( COMMA selectListItem ) ] CLOSE
selectListItem     = STAR ; all structural properties
                   / allOperationsInSchema
                   / [ ( qualifiedEntityTypeName / qualifiedComplexTypeName ) "/" ]
                     ( qualifiedActionName
                     / qualifiedFunctionName
                     / selectListProperty
                     )
selectListProperty = primitiveProperty
                   / primitiveColProperty
                   / ( navigationProperty / entityAnnotationInFragment ) [ "+" ] [ selectList ]
                   / ( complexProperty / complexColProperty / complexAnnotationInFragment ) [ "/" qualifiedComplexTypeName ] [ "/" selectListProperty ]

contextPropertyPath = primitiveProperty
                    / primitiveColProperty
                    / complexColProperty
                    / complexProperty [ [ "/" qualifiedComplexTypeName ] "/" contextPropertyPath ]

qualifiedActionName   = namespace "." action
qualifiedFunctionName = namespace "." function [ OPEN parameterNames CLOSE ]

complexAnnotationInFragment = annotationInFragment ; complex-valued annotation
entityAnnotationInFragment  = annotationInFragment ; entity-valued annotation

;------------------------------------------------------------------------------
; 4. Expressions
;------------------------------------------------------------------------------

; Note: a boolCommonExpr is also a commonExpr, e.g. sort by Boolean
commonExpr = ( primitiveLiteral
             / arrayOrObject
             / rootExpr
             / firstMemberExpr
             / functionExpr
             / negateExpr
             / methodCallExpr
             / parenExpr
             / castExpr
             / isofExpr
             / notExpr
             )
             [ addExpr
             / subExpr
             / mulExpr
             / divExpr
             / divbyExpr
             / modExpr
             ]
             [ eqExpr
             / neExpr
             / ltExpr
             / leExpr
             / gtExpr
             / geExpr
             / hasExpr
             / inExpr
             ]
             [ andExpr
             / orExpr
             ]

boolCommonExpr = commonExpr ; resulting in a Boolean

rootExpr = '$root/' ( entitySetName keyPredicate / singletonEntity ) [ singleNavigationExpr ]

firstMemberExpr = memberExpr
                / inscopeVariableExpr [ "/" memberExpr ]

memberExpr = directMemberExpr
           / ( optionallyQualifiedEntityTypeName / optionallyQualifiedComplexTypeName ) "/" directMemberExpr

directMemberExpr = propertyPathExpr
                 / boundFunctionExpr
                 / annotationExpr

propertyPathExpr = ( entityColNavigationProperty [ collectionNavigationExpr ]
                   / entityNavigationProperty    [ singleNavigationExpr ]
                   / complexColProperty          [ complexColPathExpr ]
                   / complexProperty             [ complexPathExpr ]
                   / primitiveColProperty        [ collectionPathExpr ]
                   / primitiveProperty           [ primitivePathExpr ]
                   / streamProperty              [ primitivePathExpr ]
                   )

annotationExpr = annotationInQuery
                 [ collectionPathExpr
                 / singleNavigationExpr
                 / complexPathExpr
                 / primitivePathExpr
                 ]

annotationInQuery    = AT [ namespace "." ] termName [ HASH annotationQualifier ]
annotationInFragment = AT [ namespace "." ] termName [ "#"  annotationQualifier ]
annotationQualifier  = odataIdentifier

inscopeVariableExpr  = implicitVariableExpr
                     / parameterAlias
                     / lambdaVariableExpr ; only allowed inside a lambdaPredicateExpr
implicitVariableExpr = '$it'              ; the current instance of the resource identified by the resource path
                     / '$this'            ; the instance on which the query option is evaluated
lambdaVariableExpr   = odataIdentifier

collectionNavigationExpr = [ "/" optionallyQualifiedEntityTypeName ]
                           ( collectionPathExpr
                           / keyPredicate [ singleNavigationExpr ]
                           / filterExpr [ collectionNavigationExpr ]
                           )

singleNavigationExpr = "/" memberExpr

filterExpr = '/$filter' OPEN boolCommonExpr CLOSE

complexColPathExpr = collectionPathExpr
                   / "/" optionallyQualifiedComplexTypeName [ collectionPathExpr ]

collectionPathExpr = count [ OPEN expandCountOption *( SEMI expandCountOption ) CLOSE ]
                   / filterExpr [ collectionPathExpr ]
                   / "/" anyExpr
                   / "/" allExpr
                   / "/" boundFunctionExpr
                   / "/" annotationExpr

complexPathExpr = "/" directMemberExpr
                / "/" optionallyQualifiedComplexTypeName [ "/" directMemberExpr ]

primitivePathExpr = "/" [ annotationExpr / boundFunctionExpr ]

boundFunctionExpr = functionExpr ; boundFunction segments can only be composed if the type of the
                                 ; previous segment matches the type of the first function parameter

functionExpr = [ namespace "." ]
               ( entityColFunction    functionExprParameters [ collectionNavigationExpr ]
               / entityFunction       functionExprParameters [ singleNavigationExpr ]
               / complexColFunction   functionExprParameters [ complexColPathExpr ]
               / complexFunction      functionExprParameters [ complexPathExpr ]
               / primitiveColFunction functionExprParameters [ collectionPathExpr ]
               / primitiveFunction    functionExprParameters [ primitivePathExpr ]
               )

functionExprParameters = OPEN [ functionExprParameter *( COMMA functionExprParameter ) ] CLOSE
functionExprParameter  = parameterName EQ ( parameterAlias / parameterValue )

anyExpr = "any" OPEN BWS [ lambdaVariableExpr BWS COLON BWS lambdaPredicateExpr ] BWS CLOSE
allExpr = "all" OPEN BWS   lambdaVariableExpr BWS COLON BWS lambdaPredicateExpr   BWS CLOSE
lambdaPredicateExpr = boolCommonExpr ; containing at least one lambdaVariableExpr

methodCallExpr = indexOfMethodCallExpr
               / toLowerMethodCallExpr
               / toUpperMethodCallExpr
               / trimMethodCallExpr
               / substringMethodCallExpr
               / concatMethodCallExpr
               / lengthMethodCallExpr
               / matchesPatternMethodCallExpr
               / yearMethodCallExpr
               / monthMethodCallExpr
               / dayMethodCallExpr
               / hourMethodCallExpr
               / minuteMethodCallExpr
               / secondMethodCallExpr
               / fractionalsecondsMethodCallExpr
               / totalsecondsMethodCallExpr
               / dateMethodCallExpr
               / timeMethodCallExpr
               / roundMethodCallExpr
               / floorMethodCallExpr
               / ceilingMethodCallExpr
               / distanceMethodCallExpr
               / geoLengthMethodCallExpr
               / totalOffsetMinutesMethodCallExpr
               / minDateTimeMethodCallExpr
               / maxDateTimeMethodCallExpr
               / nowMethodCallExpr
               / caseMethodCallExpr
               / boolMethodCallExpr

boolMethodCallExpr = endsWithMethodCallExpr
                   / startsWithMethodCallExpr
                   / containsMethodCallExpr
                   / intersectsMethodCallExpr
                   / hasSubsetMethodCallExpr
                   / hasSubsequenceMethodCallExpr

concatMethodCallExpr         = "concat"         OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
containsMethodCallExpr       = "contains"       OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
endsWithMethodCallExpr       = "endswith"       OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
indexOfMethodCallExpr        = "indexof"        OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
lengthMethodCallExpr         = "length"         OPEN BWS commonExpr BWS CLOSE
matchesPatternMethodCallExpr = "matchesPattern" OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
startsWithMethodCallExpr     = "startswith"     OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
substringMethodCallExpr      = "substring"      OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS [ COMMA BWS commonExpr BWS ] CLOSE
toLowerMethodCallExpr        = "tolower"        OPEN BWS commonExpr BWS CLOSE
toUpperMethodCallExpr        = "toupper"        OPEN BWS commonExpr BWS CLOSE
trimMethodCallExpr           = "trim"           OPEN BWS commonExpr BWS CLOSE

yearMethodCallExpr               = "year"               OPEN BWS commonExpr BWS CLOSE
monthMethodCallExpr              = "month"              OPEN BWS commonExpr BWS CLOSE
dayMethodCallExpr                = "day"                OPEN BWS commonExpr BWS CLOSE
hourMethodCallExpr               = "hour"               OPEN BWS commonExpr BWS CLOSE
minuteMethodCallExpr             = "minute"             OPEN BWS commonExpr BWS CLOSE
secondMethodCallExpr             = "second"             OPEN BWS commonExpr BWS CLOSE
fractionalsecondsMethodCallExpr  = "fractionalseconds"  OPEN BWS commonExpr BWS CLOSE
totalsecondsMethodCallExpr       = "totalseconds"       OPEN BWS commonExpr BWS CLOSE
dateMethodCallExpr               = "date"               OPEN BWS commonExpr BWS CLOSE
timeMethodCallExpr               = "time"               OPEN BWS commonExpr BWS CLOSE
totalOffsetMinutesMethodCallExpr = "totaloffsetminutes" OPEN BWS commonExpr BWS CLOSE

minDateTimeMethodCallExpr = "mindatetime" OPEN BWS CLOSE
maxDateTimeMethodCallExpr = "maxdatetime" OPEN BWS CLOSE
nowMethodCallExpr         = "now"         OPEN BWS CLOSE

roundMethodCallExpr   = "round"   OPEN BWS commonExpr BWS CLOSE
floorMethodCallExpr   = "floor"   OPEN BWS commonExpr BWS CLOSE
ceilingMethodCallExpr = "ceiling" OPEN BWS commonExpr BWS CLOSE

distanceMethodCallExpr   = "geo.distance"   OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
geoLengthMethodCallExpr  = "geo.length"     OPEN BWS commonExpr BWS CLOSE
intersectsMethodCallExpr = "geo.intersects" OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE

hasSubsetMethodCallExpr      = "hassubset"      OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
hasSubsequenceMethodCallExpr = "hassubsequence" OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE

caseMethodCallExpr = "case" OPEN BWS boolCommonExpr BWS COLON BWS commonExpr BWS
                        *( COMMA BWS boolCommonExpr BWS COLON BWS commonExpr BWS ) CLOSE

parenExpr = OPEN BWS commonExpr BWS CLOSE
listExpr  = OPEN BWS primitiveLiteral BWS *( COMMA BWS primitiveLiteral BWS ) CLOSE

andExpr = RWS "and" RWS boolCommonExpr
orExpr  = RWS "or"  RWS boolCommonExpr

eqExpr = RWS "eq" RWS commonExpr
neExpr = RWS "ne" RWS commonExpr
ltExpr = RWS "lt" RWS commonExpr
leExpr = RWS "le" RWS commonExpr
gtExpr = RWS "gt" RWS commonExpr
geExpr = RWS "ge" RWS commonExpr
inExpr = RWS "in" RWS ( listExpr / commonExpr )

hasExpr = RWS "has" RWS enum

addExpr   = RWS "add"   RWS commonExpr
subExpr   = RWS "sub"   RWS commonExpr
mulExpr   = RWS "mul"   RWS commonExpr
divExpr   = RWS "div"   RWS commonExpr
divbyExpr = RWS "divby" RWS commonExpr
modExpr   = RWS "mod"   RWS commonExpr

negateExpr = "-" BWS commonExpr

notExpr = "not" RWS boolCommonExpr

isofExpr = "isof" OPEN BWS [ commonExpr BWS COMMA BWS ] optionallyQualifiedTypeName BWS CLOSE
castExpr = "cast" OPEN BWS [ commonExpr BWS COMMA BWS ] optionallyQualifiedTypeName BWS CLOSE



;------------------------------------------------------------------------------
; 5. JSON format for queries
;------------------------------------------------------------------------------
; Note: the query part of a URI needs to be percent-encoding normalized before
; applying these rules, see comment at the top of this file
;------------------------------------------------------------------------------

arrayOrObject = array
              / object

array = begin-array
        [ valueInUrl *( value-separator valueInUrl ) ]
        end-array

object = begin-object
         [ member *( value-separator member ) ]
         end-object

member = stringInUrl name-separator valueInUrl

valueInUrl = stringInUrl
           / commonExpr

; JSON syntax: adapted to URI restrictions from [RFC8259]
begin-object = BWS ( "{" / "%7B" ) BWS
end-object   = BWS ( "}" / "%7D" )

begin-array = BWS ( "[" / "%5B" ) BWS
end-array   = BWS ( "]" / "%5D" )

quotation-mark  = DQUOTE / "%22"
name-separator  = BWS COLON BWS
value-separator = BWS COMMA BWS

stringInUrl = quotation-mark *charInJSON quotation-mark

charInJSON   = qchar-unescaped
             / qchar-JSON-special
             / escape ( quotation-mark
                      / escape
                      / ( "/" / "%2F" ) ; solidus         U+002F - literal form is allowed in the query part of a URL
                      / %s"b"             ; backspace       U+0008
                      / %s"f"             ; form feed       U+000C
                      / %s"n"             ; line feed       U+000A
                      / %s"r"             ; carriage return U+000D
                      / %s"t"             ; tab             U+0009
                      / %s"u" 4HEXDIG     ;                 U+XXXX
                      )

qchar-JSON-special = SP / ":" / "{" / "}" / "[" / "]" ; some agents put these unencoded into the query part of a URL

escape = "\" / "%5C"     ; reverse solidus U+005C

;------------------------------------------------------------------------------
; 6. Names and identifiers
;------------------------------------------------------------------------------

qualifiedTypeName = singleQualifiedTypeName
                  / 'Collection' OPEN singleQualifiedTypeName CLOSE

optionallyQualifiedTypeName = singleQualifiedTypeName
                            / 'Collection' OPEN singleQualifiedTypeName CLOSE
                            / singleTypeName
                            / 'Collection' OPEN singleTypeName CLOSE

singleQualifiedTypeName = qualifiedEntityTypeName
                        / qualifiedComplexTypeName
                        / qualifiedTypeDefinitionName
                        / qualifiedEnumTypeName
                        / primitiveTypeName

singleTypeName = entityTypeName
               / complexTypeName
               / typeDefinitionName
               / enumerationTypeName

qualifiedEntityTypeName     = namespace "." entityTypeName
qualifiedComplexTypeName    = namespace "." complexTypeName
qualifiedTypeDefinitionName = namespace "." typeDefinitionName
qualifiedEnumTypeName       = namespace "." enumerationTypeName

optionallyQualifiedEntityTypeName     = [ namespace "." ] entityTypeName
optionallyQualifiedComplexTypeName    = [ namespace "." ] complexTypeName

; an alias is just a single-part namespace
namespace     = namespacePart *( "." namespacePart )
namespacePart = odataIdentifier

entitySetName       = odataIdentifier
singletonEntity     = odataIdentifier
entityTypeName      = odataIdentifier
complexTypeName     = odataIdentifier
typeDefinitionName  = odataIdentifier
enumerationTypeName = odataIdentifier
enumerationMember   = odataIdentifier
termName            = odataIdentifier

; Note: this pattern is overly restrictive, the normative definition is type TSimpleIdentifier in OData EDM XML Schema
odataIdentifier             = identifierLeadingCharacter *127identifierCharacter
identifierLeadingCharacter  = ALPHA / "_"         ; plus Unicode characters from the categories L or Nl
identifierCharacter         = ALPHA / "_" / DIGIT ; plus Unicode characters from the categories L, Nl, Nd, Mn, Mc, Pc, or Cf

primitiveTypeName = 'Edm.' ( 'Binary'
                           / 'Boolean'
                           / 'Byte'
                           / 'Date'
                           / 'DateTimeOffset'
                           / 'Decimal'
                           / 'Double'
                           / 'Duration'
                           / 'Guid'
                           / 'Int16'
                           / 'Int32'
                           / 'Int64'
                           / 'SByte'
                           / 'Single'
                           / 'Stream'
                           / 'String'
                           / 'TimeOfDay'
                           / abstractSpatialTypeName [ concreteSpatialTypeName ]
                           )
abstractSpatialTypeName = 'Geography'
                        / 'Geometry'
concreteSpatialTypeName = 'Collection'
                        / 'LineString'
                        / 'MultiLineString'
                        / 'MultiPoint'
                        / 'MultiPolygon'
                        / 'Point'
                        / 'Polygon'

primitiveProperty       = primitiveKeyProperty / primitiveNonKeyProperty
primitiveKeyProperty    = odataIdentifier
primitiveNonKeyProperty = odataIdentifier
primitiveColProperty    = odataIdentifier
complexProperty         = odataIdentifier
complexColProperty      = odataIdentifier
streamProperty          = odataIdentifier

navigationProperty          = entityNavigationProperty / entityColNavigationProperty
entityNavigationProperty    = odataIdentifier
entityColNavigationProperty = odataIdentifier

action       = odataIdentifier
actionImport = odataIdentifier

function = entityFunction
         / entityColFunction
         / complexFunction
         / complexColFunction
         / primitiveFunction
         / primitiveColFunction

entityFunction       = odataIdentifier
entityColFunction    = odataIdentifier
complexFunction      = odataIdentifier
complexColFunction   = odataIdentifier
primitiveFunction    = odataIdentifier
primitiveColFunction = odataIdentifier

entityFunctionImport       = odataIdentifier
entityColFunctionImport    = odataIdentifier
complexFunctionImport      = odataIdentifier
complexColFunctionImport   = odataIdentifier
primitiveFunctionImport    = odataIdentifier
primitiveColFunctionImport = odataIdentifier


;------------------------------------------------------------------------------
; 7. Literal Data Values
;------------------------------------------------------------------------------

; in URLs
primitiveLiteral = nullValue                  ; plain values up to int64Value
                 / booleanValue
                 / guidValue
                 / dateTimeOffsetValueInUrl
                 / dateValue
                 / timeOfDayValueInUrl
                 / decimalValue
                 / doubleValue
                 / singleValue
                 / sbyteValue
                 / byteValue
                 / int16Value
                 / int32Value
                 / int64Value
                 / string                     ; single-quoted
                 / duration
                 / enum
                 / binary                     ; all others are quoted and prefixed
                 / geographyCollection
                 / geographyLineString
                 / geographyMultiLineString
                 / geographyMultiPoint
                 / geographyMultiPolygon
                 / geographyPoint
                 / geographyPolygon
                 / geometryCollection
                 / geometryLineString
                 / geometryMultiLineString
                 / geometryMultiPoint
                 / geometryMultiPolygon
                 / geometryPoint
                 / geometryPolygon


nullValue = 'null'

; base64url encoding according to http://tools.ietf.org/html/rfc4648#section-5
binary      = "binary" SQUOTE binaryValue SQUOTE
binaryValue = *(4base64char) [ base64b16  / base64b8 ]
base64b16   = 2base64char ( 'A' / 'E' / 'I' / 'M' / 'Q' / 'U' / 'Y' / 'c' / 'g' / 'k' / 'o' / 's' / 'w' / '0' / '4' / '8' )   [ "=" ]
base64b8    = base64char ( 'A' / 'Q' / 'g' / 'w' ) [ "==" ]
base64char  = ALPHA / DIGIT / "-" / "_"

booleanValue = "true" / "false"

decimalValue = [ SIGN ] 1*DIGIT [ "." 1*DIGIT ] [ "e" [ SIGN ] 1*DIGIT ] / nanInfinity
doubleValue  = decimalValue ; IEEE 754 binary64 floating-point number (15-17 decimal digits)
singleValue  = decimalValue ; IEEE 754 binary32 floating-point number (6-9 decimal digits)
nanInfinity  = 'NaN' / '-INF' / 'INF'

guidValue = 8HEXDIG "-" 4HEXDIG "-" 4HEXDIG "-" 4HEXDIG "-" 12HEXDIG

byteValue  = 1*3DIGIT           ; numbers in the range from 0 to 255
sbyteValue = [ SIGN ] 1*3DIGIT  ; numbers in the range from -128 to 127
int16Value = [ SIGN ] 1*5DIGIT  ; numbers in the range from -32768 to 32767
int32Value = [ SIGN ] 1*10DIGIT ; numbers in the range from -2147483648 to 2147483647
int64Value = [ SIGN ] 1*19DIGIT ; numbers in the range from -9223372036854775808 to 9223372036854775807

string           = SQUOTE *( SQUOTE-in-string / pchar-no-SQUOTE ) SQUOTE
SQUOTE-in-string = SQUOTE SQUOTE ; two consecutive single quotes represent one within a string literal

dateValue = year "-" month "-" day

dateTimeOffsetValue      = year "-" month "-" day "T" timeOfDayValue      ( "Z" / SIGN hour ":"   minute )
dateTimeOffsetValueInUrl = year "-" month "-" day "T" timeOfDayValueInUrl ( "Z" / SIGN hour COLON minute )

duration      = [ "duration" ] SQUOTE durationValue SQUOTE
durationValue = [ SIGN ] "P" [ 1*DIGIT "D" ] [ "T" [ 1*DIGIT "H" ] [ 1*DIGIT "M" ] [ 1*DIGIT [ "." 1*DIGIT ] "S" ] ]
     ; the above is an approximation of the rules for an xml dayTimeDuration.
     ; see the lexical representation for dayTimeDuration in http://www.w3.org/TR/xmlschema11-2#dayTimeDuration for more information

timeOfDayValue      = hour ":"   minute [ ":"   second [ "." fractionalSeconds ] ]
timeOfDayValueInUrl = hour COLON minute [ COLON second [ "." fractionalSeconds ] ]

oneToNine       = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9"
zeroToFiftyNine = ( "0" / "1" / "2" / "3" / "4" / "5" ) DIGIT
year  = [ "-" ] ( "0" 3DIGIT / oneToNine 3*DIGIT )
month = "0" oneToNine
      / "1" ( "0" / "1" / "2" )
day   = "0" oneToNine
      / ( "1" / "2" ) DIGIT
      / "3" ( "0" / "1" )
hour   = ( "0" / "1" ) DIGIT
       / "2" ( "0" / "1" / "2" / "3" )
minute = zeroToFiftyNine
second = zeroToFiftyNine / "60" ; for leap seconds
fractionalSeconds = 1*12DIGIT

enum            = [ qualifiedEnumTypeName ] SQUOTE enumValue SQUOTE
enumValue       = singleEnumValue *( COMMA singleEnumValue )
singleEnumValue = enumerationMember / enumMemberValue
enumMemberValue = int64Value

geographyCollection   = geographyPrefix SQUOTE fullCollectionLiteral SQUOTE
fullCollectionLiteral = sridLiteral collectionLiteral
collectionLiteral     = "Collection(" geoLiteral *( COMMA geoLiteral ) CLOSE
geoLiteral            = collectionLiteral
                      / lineStringLiteral
                      / multiPointLiteral
                      / multiLineStringLiteral
                      / multiPolygonLiteral
                      / pointLiteral
                      / polygonLiteral

geographyLineString   = geographyPrefix SQUOTE fullLineStringLiteral SQUOTE
fullLineStringLiteral = sridLiteral lineStringLiteral
lineStringLiteral     = "LineString" lineStringData
lineStringData        = OPEN positionLiteral 1*( COMMA positionLiteral ) CLOSE

geographyMultiLineString   = geographyPrefix SQUOTE fullMultiLineStringLiteral SQUOTE
fullMultiLineStringLiteral = sridLiteral multiLineStringLiteral
multiLineStringLiteral     = "MultiLineString(" [ lineStringData *( COMMA lineStringData ) ] CLOSE

geographyMultiPoint   = geographyPrefix SQUOTE fullMultiPointLiteral SQUOTE
fullMultiPointLiteral = sridLiteral multiPointLiteral
multiPointLiteral     = "MultiPoint(" [ pointData *( COMMA pointData ) ] CLOSE

geographyMultiPolygon   = geographyPrefix SQUOTE fullMultiPolygonLiteral SQUOTE
fullMultiPolygonLiteral = sridLiteral multiPolygonLiteral
multiPolygonLiteral     = "MultiPolygon(" [ polygonData *( COMMA polygonData ) ] CLOSE

geographyPoint   = geographyPrefix SQUOTE fullPointLiteral SQUOTE
fullPointLiteral = sridLiteral pointLiteral
sridLiteral      = "SRID" EQ 1*5DIGIT SEMI
pointLiteral     ="Point" pointData
pointData        = OPEN positionLiteral CLOSE
positionLiteral  = doubleValue SP doubleValue [ SP doubleValue ] [ SP doubleValue ] ; longitude, latitude, altitude/elevation (optional), linear referencing measure (optional)

geographyPolygon   = geographyPrefix SQUOTE fullPolygonLiteral SQUOTE
fullPolygonLiteral = sridLiteral polygonLiteral
polygonLiteral     = "Polygon" polygonData
polygonData        = OPEN ringLiteral *( COMMA ringLiteral ) CLOSE
ringLiteral        = OPEN positionLiteral *( COMMA positionLiteral ) CLOSE
                   ; Within each ringLiteral, the first and last positionLiteral elements MUST be an exact syntactic match to each other.
                   ; Within the polygonData, the ringLiterals MUST specify their points in appropriate winding order.
                   ; In order of traversal, points to the left side of the ring are interpreted as being in the polygon.

geometryCollection      = geometryPrefix SQUOTE fullCollectionLiteral      SQUOTE
geometryLineString      = geometryPrefix SQUOTE fullLineStringLiteral      SQUOTE
geometryMultiLineString = geometryPrefix SQUOTE fullMultiLineStringLiteral SQUOTE
geometryMultiPoint      = geometryPrefix SQUOTE fullMultiPointLiteral      SQUOTE
geometryMultiPolygon    = geometryPrefix SQUOTE fullMultiPolygonLiteral    SQUOTE
geometryPoint           = geometryPrefix SQUOTE fullPointLiteral           SQUOTE
geometryPolygon         = geometryPrefix SQUOTE fullPolygonLiteral         SQUOTE

geographyPrefix = "geography"
geometryPrefix  = "geometry"


obs-text       = %x80-FF



;------------------------------------------------------------------------------
; 9. Punctuation
;------------------------------------------------------------------------------

RWS = 1*( SP / HTAB / "%20" / "%09" )  ; "required" whitespace
BWS =  *( SP / HTAB / "%20" / "%09" )  ; "bad" whitespace

AT     = "@" / "%40"
COLON  = ":" / "%3A"
COMMA  = "," / "%2C"
EQ     = "="
HASH   = "%23" ; the # character is not allowed in the query part
SIGN   = "+" / "%2B" / "-"
SEMI   = ";" / "%3B"
STAR   = "*" / "%2A"
SQUOTE = "'" / "%27"

OPEN  = "(" / "%28"
CLOSE = ")" / "%29"


;------------------------------------------------------------------------------
; A. URI syntax [RFC3986]
;------------------------------------------------------------------------------

URI           = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
hier-part     = "//" authority path-abempty
              / path-absolute
              / path-rootless
;              / path-empty
;URI-reference = URI / relative-ref
;absolute-URI  = scheme ":" hier-part [ "?" query ]
;relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
;relative-part = "//" authority path-abempty
;              / path-absolute
;              / path-noscheme
;              / path-empty
scheme        = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
authority     = [ userinfo "@" ] host [ ":" port ]
userinfo      = *( unreserved / pct-encoded / sub-delims / ":" )
host          = IP-literal / IPv4address / reg-name
port          = *DIGIT
IP-literal    = "[" ( IPv6address / IPvFuture  ) "]"
IPvFuture     = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
IPv6address   =                            6( h16 ":" ) ls32
                 /                       "::" 5( h16 ":" ) ls32
                 / [               h16 ] "::" 4( h16 ":" ) ls32
                 / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
                 / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
                 / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
                 / [ *4( h16 ":" ) h16 ] "::"              ls32
                 / [ *5( h16 ":" ) h16 ] "::"              h16
                 / [ *6( h16 ":" ) h16 ] "::"
h16           = 1*4HEXDIG
ls32          = ( h16 ":" h16 ) / IPv4address
IPv4address   = dec-octet "." dec-octet "." dec-octet "." dec-octet
dec-octet     = "1" 2DIGIT            ; 100-199
              / "2" %x30-34 DIGIT     ; 200-249
              / "25" %x30-35          ; 250-255
              / %x31-39 DIGIT         ; 10-99
              / DIGIT                 ; 0-9
reg-name      = *( unreserved / pct-encoded / sub-delims )
;path          = path-abempty    ; begins with "/" or is empty
;              / path-absolute   ; begins with "/" but not "//"
;              / path-noscheme   ; begins with a non-colon segment
;              / path-rootless   ; begins with a segment
;              / path-empty      ; zero characters
path-abempty  = *( "/" segment )
path-absolute = "/" [ segment-nz *( "/" segment ) ]
;path-noscheme = segment-nz-nc *( "/" segment )
path-rootless = segment-nz *( "/" segment )
;path-empty    = ""
segment       = *pchar
segment-nz    = 1*pchar
;segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" ) ; non-zero-length segment without any colon ":"
pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
query         = *( pchar / "/" / "?" )
fragment      = *( pchar / "/" / "?" )
pct-encoded   = "%" HEXDIG HEXDIG
unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
;reserved      = gen-delims / sub-delims
;gen-delims    = ":" / "/" / "?" / "#" / "[" / "]" / "@"
;sub-delims    = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
sub-delims     =       "$" / "&" / "'" /                                     "=" / other-delims
other-delims   = "!" /                   "(" / ")" / "*" / "+" / "," / ";"

pchar-no-SQUOTE       = unreserved / pct-encoded-no-SQUOTE / other-delims / "$" / "&" / "=" / ":" / "@"
pct-encoded-no-SQUOTE = "%" ( "0" / "1" /   "3" / "4" / "5" / "6" / "8" / "9" / A-to-F ) HEXDIG
                      / "%" "2" ( "0" / "1" / "2" / "3" / "4" / "5" / "6" /   "8" / "9" / A-to-F )

qchar-no-AMP              = unreserved / pct-encoded           / other-delims / ":" / "@" / "/" / "?" / "$" / "'" / "="
qchar-no-AMP-EQ           = unreserved / pct-encoded           / other-delims / ":" / "@" / "/" / "?" / "$" / "'"
qchar-no-AMP-EQ-AT-DOLLAR = unreserved / pct-encoded           / other-delims / ":" /       "/" / "?" /       "'"
qchar-no-AMP-SQUOTE       = unreserved / pct-encoded           / other-delims / ":" / "@" / "/" / "?" / "$" /       "="
qchar-no-AMP-DQUOTE       = unreserved / pct-encoded-no-DQUOTE / other-delims / ":" / "@" / "/" / "?" / "$" / "'" / "="

qchar-unescaped       = unreserved / pct-encoded-unescaped / other-delims / ":" / "@" / "/" / "?" / "$" / "'" / "="
pct-encoded-unescaped = "%" ( "0" / "1" /   "3" / "4" /   "6" / "7" / "8" / "9" / A-to-F ) HEXDIG
                      / "%" "2" ( "0" / "1" /   "3" / "4" / "5" / "6" / "7" / "8" / "9" / A-to-F )
                      / "%" "5" ( DIGIT / "A" / "B" /   "D" / "E" / "F" )

pct-encoded-no-DQUOTE = "%" ( "0" / "1" /   "3" / "4" / "5" / "6" / "7" / "8" / "9" / A-to-F ) HEXDIG
                      / "%" "2" ( "0" / "1" /   "3" / "4" / "5" / "6" / "7" / "8" / "9" / A-to-F )


;------------------------------------------------------------------------------
; B. IRI syntax [RFC3987]
;------------------------------------------------------------------------------
; Note: these are over-generous stubs, for the actual patterns refer to RFC3987
;------------------------------------------------------------------------------

IRI-in-header = 1*( VCHAR / obs-text )
IRI-in-query  = 1*qchar-no-AMP


;------------------------------------------------------------------------------
; C. ABNF core definitions [RFC5234]
;------------------------------------------------------------------------------

ALPHA  = %x41-5A / %x61-7A
DIGIT  = %x30-39
HEXDIG = DIGIT / A-to-F
A-to-F = "A" / "B" / "C" / "D" / "E" / "F"
DQUOTE = %x22
SP     = %x20
HTAB   = %x09
;WSP    = SP / HTAB
;LWSP = *(WSP / CRLF WSP)
VCHAR = %x21-7E
;CHAR = %x01-7F
;LOCTET = %x00-FF
;CR     = %x0D
;LF     = %x0A
;CRLF   = CR LF
;BIT = "0" / "1"


;------------------------------------------------------------------------------
; End of odata-abnf-construction-rules
;------------------------------------------------------------------------------
`