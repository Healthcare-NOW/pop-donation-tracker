"""Adding candidates and committees.

Revision ID: c579f108ac7c
Revises: 
Create Date: 2020-03-03 13:12:55.631409

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c579f108ac7c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('candidate',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('fec_id', sa.String(length=9), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('party_affiliation', sa.String(length=3), nullable=True),
    sa.Column('election_year', sa.SmallInteger(), nullable=False),
    sa.Column('office', postgresql.ENUM('H', 'S', name='office'), nullable=False),
    sa.Column('office_state', sa.String(length=2), nullable=False),
    sa.Column('office_district', sa.String(length=2), nullable=True),
    sa.Column('incumbent_challenger_status', postgresql.ENUM('C', 'I', 'O', name='incumbent_challenger_status'), nullable=True),
    sa.Column('principal_campaign_committee_fec_id', sa.String(length=9), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('fec_id')
    )
    op.create_table('committee',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('fec_id', sa.String(length=9), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('designation', postgresql.ENUM('A', 'B', 'D', 'J', 'P', 'U', name='committee_designation'), nullable=True),
    sa.Column('type', sa.String(length=1), nullable=True),
    sa.Column('party_affiliation', sa.String(length=3), nullable=True),
    sa.Column('interest_group_category', postgresql.ENUM('C', 'L', 'M', 'T', 'V', 'W', 'I', 'H', name='interest_group_category'), nullable=True),
    sa.Column('connected_organization', sa.String(), nullable=True),
    sa.Column('candidate_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['candidate_id'], ['candidate.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('fec_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('committee')
    op.drop_table('candidate')
    # ### end Alembic commands ###