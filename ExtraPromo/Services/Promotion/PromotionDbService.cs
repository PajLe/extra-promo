﻿using ExtraPromo.DB.Cassandra.Interfaces;
using ExtraPromo.DbSetup.Cassandra.Models;
using ExtraPromo.DTOs;
using ExtraPromo.Services.Promotion.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExtraPromo.Services.Promotion
{
    public class PromotionDbService : IPromotionDbService
    {
        private readonly ICassandraDbConnectionProvider _cassandraDbConnectionProvider;
        private readonly ICassandraQueryProvider _cassandraQueryProvider;
        public PromotionDbService(ICassandraQueryProvider cassandraQueryProvider,
                ICassandraDbConnectionProvider cassandraDbConnectionProvider)
        {
            _cassandraQueryProvider = cassandraQueryProvider;
            _cassandraDbConnectionProvider = cassandraDbConnectionProvider;
        }

        public async Task<bool> AddPromotion(AddPromotionDto addPromotionDto)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                var preparedModifierStatement = 
                    await session.PrepareAsync("INSERT INTO modifiers (id, type, values) VALUES (?, ?, ?);");
                Dictionary<Guid, string> modifierWithType = new Dictionary<Guid, string>();
                foreach (var mod in addPromotionDto.Modifiers)
                {
                    Guid id = Guid.NewGuid();
                    modifierWithType.Add(id, mod.Type);
                    var boundModifierStatement = preparedModifierStatement.Bind(id, mod.Type, mod.Values);
                    await _cassandraQueryProvider.ExecuteAsync(session, boundModifierStatement);
                }

                var preparedActionStatement =
                    await session.PrepareAsync("INSERT INTO actions (id, type, flat, percentage, freeship, items) VALUES (?, ?, ?, ?, ?, ?);");
                Dictionary<Guid, string> actionsWithType = new Dictionary<Guid, string>();
                foreach (var action in addPromotionDto.Actions)
                {
                    Guid id = Guid.NewGuid();
                    actionsWithType.Add(id, action.Type);
                    var boundActionStatement =
                        preparedActionStatement.Bind(id, action.Type, action.Flat, action.Percentage, action.FreeShip, action.Items);
                    await _cassandraQueryProvider.ExecuteAsync(session, boundActionStatement);
                }

                Guid promoId = Guid.NewGuid();
                string cql = "INSERT INTO promotions (id, type, description, modifiers, actions) VALUES (?, ?, ?, ?, ?);";
                await _cassandraQueryProvider.ExecuteAsync(session, cql, 
                    promoId, 
                    addPromotionDto.Type, 
                    addPromotionDto.Description,
                    modifierWithType,
                    actionsWithType);

                return true;
            }
        }

        public async Task<bool> DeletePromotion(Guid id)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                string cql = "DELETE FROM promotions WHERE id = ? IF EXISTS;";
                var applied = await _cassandraQueryProvider.ExecuteAsync(session, cql, id);
                return applied.FirstOrDefault().GetValue<bool>(0);
            }
        }

        public async Task<bool> EditPromotion(Guid promoId, EditPromotionDto promotion)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                var preparedModifierStatement =
                    await session.PrepareAsync("INSERT INTO modifiers (id, type, values) VALUES (?, ?, ?);");
                Dictionary<Guid, string> modifierWithType = new Dictionary<Guid, string>();
                foreach (var mod in promotion.Modifiers)
                {
                    Guid id = Guid.NewGuid();
                    modifierWithType.Add(id, mod.Type);
                    var boundModifierStatement = preparedModifierStatement.Bind(id, mod.Type, mod.Values);
                    await _cassandraQueryProvider.ExecuteAsync(session, boundModifierStatement);
                }

                var preparedActionStatement =
                    await session.PrepareAsync("INSERT INTO actions (id, type, flat, percentage, freeship, items) VALUES (?, ?, ?, ?, ?, ?);");
                Dictionary<Guid, string> actionsWithType = new Dictionary<Guid, string>();
                foreach (var action in promotion.Actions)
                {
                    Guid id = Guid.NewGuid();
                    actionsWithType.Add(id, action.Type);
                    var boundActionStatement =
                        preparedActionStatement.Bind(id, action.Type, action.Flat, action.Percentage, action.FreeShip, action.Items);
                    await _cassandraQueryProvider.ExecuteAsync(session, boundActionStatement);
                }

                char[] charsToTrim = { ',', ' ' };
                bool doUpdate = false;
                string cql = "UPDATE promotions SET ";
                if (!string.IsNullOrWhiteSpace(promotion.Description))
                {
                    cql += $" description = '{promotion.Description}' , ";
                    doUpdate = true;
                }
                if (!string.IsNullOrWhiteSpace(promotion.Type))
                {
                    cql += $" type = '{promotion.Type}' , ";
                    doUpdate = true;
                }
                if (modifierWithType.Any())
                {
                    cql += $" modifiers = modifiers + {{ ";
                    foreach (var modWithType in modifierWithType)
                        cql += $" {modWithType.Key}:'{modWithType.Value}', ";
                    cql = cql.TrimEnd(charsToTrim);
                    cql += $" }} , ";
                    doUpdate = true;
                }
                if (actionsWithType.Any())
                {
                    cql += $" actions = actions + {{ ";
                    foreach (var actionWithType in actionsWithType)
                        cql += $" {actionWithType.Key}:'{actionWithType.Value}', ";
                    cql = cql.TrimEnd(charsToTrim);
                    cql += $" }} , ";
                    doUpdate = true;
                }
                cql = cql.TrimEnd(charsToTrim);
                cql += " WHERE id = ?;";

                if (doUpdate)
                    await _cassandraQueryProvider.ExecuteAsync(session, cql, promoId);

                return true;
            }
        }

        public async Task<PromotionActionDto> GetActionWithId(Guid id)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                string cql = "SELECT * FROM actions WHERE id = ?;";
                var action = await _cassandraQueryProvider.QuerySingleOrDefault<ActionModel>(session, cql, id);
                var actionToReturn = new PromotionActionDto
                {
                    Id = action.Id.ToString(),
                    Type = action.Type,
                    Flat = action.Flat,
                    Percentage = action.Percentage,
                    FreeShip = action.FreeShip,
                    Items = action.Items.ToArray()
                };
                return actionToReturn;
            }
        }

        public async Task<IEnumerable<GetPromotionDto>> GetAllPromotions()
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                string cql = "SELECT * FROM promotions;";
                var promotions = await _cassandraQueryProvider.FetchAsync<PromotionModel>(session, cql);
                List<GetPromotionDto> promotionsToReturn = new List<GetPromotionDto>();
                foreach (var promo in promotions)
                {
                    promotionsToReturn.Add(new GetPromotionDto
                    {
                        Id = promo.Id.ToString(),
                        Type = promo.Type,
                        Description = promo.Description,
                        Modifiers = promo.Modifiers.Select(mod => new GetPromotionModifierDto { Id = mod.Key, Type = mod.Value }),
                        Actions = promo.Actions.Select(action => new GetPromotionActionDto { Id = action.Key, Type = action.Value })
                    });
                }
                
                return promotionsToReturn;
            }
        }

        public async Task<PromotionModifierDto> GetModifierWithId(Guid id)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                string cql = "SELECT * FROM modifiers WHERE id = ?;";
                var modifier = await _cassandraQueryProvider.QuerySingleOrDefault<ModifierModel>(session, cql, id);
                var modifierToReturn = new PromotionModifierDto
                {
                    Id = modifier.Id.ToString(),
                    Type = modifier.Type,
                    Values = modifier.Values.ToArray()
                };
                return modifierToReturn;
            }
        }

        public async Task<GetPromotionDto> GetPromotionWithId(Guid id)
        {
            using (var session = _cassandraDbConnectionProvider.Connect())
            {
                string cql = "SELECT * FROM promotions WHERE id = ?;";
                var promo = await _cassandraQueryProvider.QuerySingleOrDefault<PromotionModel>(session, cql, id);
                var promoToReturn = new GetPromotionDto
                {
                    Id = promo.Id.ToString(),
                    Type = promo.Type,
                    Description = promo.Description,
                    Modifiers = promo.Modifiers.Select(mod => new GetPromotionModifierDto { Id = mod.Key, Type = mod.Value }),
                    Actions = promo.Actions.Select(action => new GetPromotionActionDto { Id = action.Key, Type = action.Value })
                };
                return promoToReturn;
            }
        }
    }
}
