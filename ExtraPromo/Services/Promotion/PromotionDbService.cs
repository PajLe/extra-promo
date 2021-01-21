﻿using ExtraPromo.DB.Cassandra.Interfaces;
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
                    await session.PrepareAsync("INSERT INTO actions (id, flat, percentage, freeship, items) VALUES (?, ?, ?, ?, ?);");
                Dictionary<Guid, string> actionsWithType = new Dictionary<Guid, string>();
                foreach (var action in addPromotionDto.Actions)
                {
                    Guid id = Guid.NewGuid();
                    actionsWithType.Add(id, action.Type);
                    var boundActionStatement =
                        preparedActionStatement.Bind(id, action.Flat, action.Percentage, action.FreeShip, action.Items);
                    await _cassandraQueryProvider.ExecuteAsync(session, boundActionStatement);
                }

                Guid promoId = Guid.NewGuid();
                string cql = "INSERT INTO promotions (id, isarchived, type, description, modifiers, actions) VALUES (?, ?, ?, ?, ?, ?);";
                await _cassandraQueryProvider.ExecuteAsync(session, cql, 
                    promoId, 
                    false, 
                    addPromotionDto.Type, 
                    addPromotionDto.Description,
                    modifierWithType,
                    actionsWithType);

                return true;
            }
        }
    }
}